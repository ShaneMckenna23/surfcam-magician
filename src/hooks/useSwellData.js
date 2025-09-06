import { useState, useEffect } from "react";

const RATING_TEXT = {
  0: "Poor",
  1: "Poor - Fair",
  2: "Fair", 
  3: "Fair - Good",
  4: "Good",
  5: "Very Good",
  6: "Epic"
};

export default function useSwellData(spotId) {
  const [swellData, setSwellData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchSwellData(spotId) {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both wave and rating data from Surfline API (like meta-surf-forecast)
      const [waveResponse, ratingResponse] = await Promise.all([
        fetch(`/kbyg/spots/forecasts/wave?spotId=${spotId}&days=10&intervalHours=1`),
        fetch(`/kbyg/spots/forecasts/rating?spotId=${spotId}&days=10&intervalHours=1`)
      ]);
      
      if (!waveResponse.ok || !ratingResponse.ok) {
        throw new Error(`Failed to fetch swell data`);
      }
      
      const waveData = await waveResponse.json();
      const ratingData = await ratingResponse.json();
      
      // Process the data into chart format
      const waveForecasts = waveData.data?.wave || [];
      const ratingForecasts = ratingData.data?.rating || [];
      
      // Create a map of ratings by timestamp for easy lookup
      const ratingsMap = {};
      ratingForecasts.forEach(r => {
        ratingsMap[r.timestamp] = r.rating?.value || 0;
      });
      
      // Transform data for the chart
      const xLabels = [];
      const maxData = [];
      const avgData = [];
      const minData = [];
      
      waveForecasts.forEach((point) => {
        const timestamp = new Date(point.timestamp * 1000);
        const hour = timestamp.getHours();
        
        // Create x-axis label - show day at midnight, hour at 6AM, noon, 6PM
        let label = "";
        if (hour === 0) {
          label = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (hour === 6) {
          label = "6am";
        } else if (hour === 12) {
          label = "noon";
        } else if (hour === 18) {
          label = "6pm";
        }
        xLabels.push(label);
        
        // Get wave heights (already in feet from API)
        const minHeight = point.surf?.raw?.min || point.surf?.min || 0;
        const maxHeight = point.surf?.raw?.max || point.surf?.max || 0;
        const avgHeight = (minHeight + maxHeight) / 2;
        const deltaMax = maxHeight - avgHeight;
        const deltaAvg = avgHeight - minHeight;
        
        // Get rating from the rating API (like meta-surf-forecast)
        // The rating value is 0-5, we multiply by 5/4 to get 0-6.25, then round to 0-6
        const ratingValue = ratingsMap[point.timestamp] || 0;
        const rating = Math.round(ratingValue * 5 / 4);
        const ratingClass = `rating-${rating}`;
        const ratingText = RATING_TEXT[rating];
        
        // Build data points
        maxData.push({
          y: deltaMax,
          className: ratingClass
        });
        
        avgData.push({
          y: deltaAvg,
          className: ratingClass
        });
        
        minData.push({
          y: minHeight,
          className: ratingClass,
          rating: ratingText,
          tooltip_time: timestamp.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            hour12: true
          })
        });
      });
      
      // Format series data for Highcharts
      const seriesData = [
        { 
          name: 'Max', 
          data: maxData, 
          stack: 'All' 
        },
        { 
          name: 'Avg', 
          data: avgData, 
          stack: 'All'
        },
        { 
          name: 'Min', 
          data: minData, 
          stack: 'All' 
        }
      ];
      
      // Calculate max y-axis value
      const maxY = Math.ceil(Math.max(...waveForecasts.map(p => p.surf?.raw?.max || p.surf?.max || 0))) + 1;
      
      // Find Monday-Sunday band for current week
      let plotBands = [];
      const now = new Date();
      const currentDay = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - currentDay + 1);
      monday.setHours(0, 0, 0, 0);
      
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      
      // Find indices for Monday and Sunday in our data
      let fromIndex = -1;
      let toIndex = -1;
      
      waveForecasts.forEach((point, index) => {
        const pointTime = new Date(point.timestamp * 1000);
        if (fromIndex === -1 && pointTime >= monday) {
          fromIndex = index;
        }
        if (pointTime <= sunday) {
          toIndex = index;
        }
      });
      
      if (fromIndex !== -1 && toIndex !== -1) {
        plotBands = [{
          from: fromIndex - 0.5,
          to: toIndex + 0.5,
          color: 'rgba(68, 170, 213, 0.1)'
        }];
      }
      
      setSwellData({
        data: seriesData,
        xLabels: xLabels,
        plotBands: plotBands,
        max: maxY
      });
      
    } catch (err) {
      console.error("Error fetching swell data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (spotId) {
      // Fetch immediately
      fetchSwellData(spotId);
      
      // Set up auto-refresh every 2 hours (7200000 ms)
      const refreshInterval = setInterval(() => {
        console.log('Auto-refreshing swell data...');
        fetchSwellData(spotId);
      }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
      
      // Cleanup interval on unmount or when spotId changes
      return () => clearInterval(refreshInterval);
    }
  }, [spotId]);

  return { swellData, loading, error };
}