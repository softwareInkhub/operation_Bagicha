# Search Firebase Integration

This document explains the Firebase integration for search functionality in the Bagicha app.

## Overview

The search functionality has been updated to fetch data from Firebase instead of using hardcoded data. This includes:

1. **SearchModal** - Now fetches search results, recent searches, and trending searches from Firebase
2. **SearchBar** - Now fetches search suggestions from Firebase
3. **FeaturedProducts** - Now fetches plant products from Firebase instead of showing grocery items

## Firebase Collections

### 1. searchSuggestions
Stores search suggestions that appear in the search bar and modal.

**Structure:**
```typescript
{
  id: string
  term: string          // The search term
  type: 'product' | 'category'
  category: string      // Optional category
}
```

### 2. recentSearches
Stores user's recent search history.

**Structure:**
```typescript
{
  id: string
  term: string          // The search term
  timestamp: Date       // When the search was performed
}
```

### 3. trendingSearches
Stores trending search terms with popularity metrics.

**Structure:**
```typescript
{
  id: string
  term: string          // The search term
  count: number         // Search count/popularity
  trend: 'up' | 'down' | 'stable'  // Trend direction
}
```

## Firebase Functions

### Search Functions
- `getSearchSuggestions()` - Fetch all search suggestions
- `getRecentSearches()` - Fetch recent searches
- `getTrendingSearches()` - Fetch trending searches
- `searchProducts(query)` - Search products by query
- `addRecentSearch(term)` - Add a search term to recent searches
- `createSampleSearchData()` - Create sample search data

## Component Updates

### SearchModal
- **Before**: Used hardcoded search results, recent searches, and trending searches
- **After**: Fetches data from Firebase collections
- **Features**:
  - Real-time search results from product database
  - Dynamic recent searches with timestamps
  - Trending searches with popularity metrics
  - Automatic addition of searches to recent history

### SearchBar
- **Before**: Used hardcoded search suggestions
- **After**: Fetches suggestions from Firebase
- **Features**:
  - Dynamic search suggestions
  - Loading state while fetching data
  - Fallback suggestions if Firebase fails

### FeaturedProducts
- **Before**: Showed hardcoded grocery items (tomatoes, bananas, etc.)
- **After**: Fetches plant products from Firebase
- **Features**:
  - Shows only plant-related products
  - Filters by rating, stock status, and plant categories
  - Dynamic badges based on product attributes
  - Loading and empty states

## Admin Interface

### Search Management Page
New admin page at `/admin/search-management` with:

1. **Search Suggestions Tab**
   - View all search suggestions
   - Add new suggestions
   - Delete suggestions
   - Filter by type (product/category)

2. **Recent Searches Tab**
   - View user search history
   - Delete individual searches
   - Shows timestamps

3. **Trending Searches Tab**
   - View trending searches
   - Add new trending terms
   - Set count and trend direction
   - Delete trending searches

### Products Page
Added "Create Search Data" button to generate sample search data.

## Sample Data

When you click "Create Sample Data" in the admin panel, it creates:

### Search Suggestions
- monstera plant (product)
- snake plant (product)
- gardening tools (category)
- organic soil (product)
- flower seeds (product)
- plant pots (product)
- fertilizer (category)
- succulents (product)
- air purifying plants (product)
- herb garden (category)
- bonsai trees (product)
- vertical garden (category)

### Recent Searches
- monstera plant (2 hours ago)
- gardening tools (1 day ago)
- organic soil (2 days ago)
- flower seeds (3 days ago)
- plant pots (5 days ago)

### Trending Searches
- succulents (156 searches, trending up)
- air purifying plants (134 searches, trending up)
- herb garden (98 searches, trending up)
- bonsai trees (87 searches, stable)
- vertical garden (76 searches, trending up)

## Usage Instructions

### For Admins
1. Go to Admin Panel → Search Management
2. Use "Create Sample Data" to populate initial data
3. Add/edit/delete search suggestions and trending searches
4. Monitor recent searches

### For Users
1. Search functionality works automatically
2. Recent searches are saved automatically
3. Trending searches update based on popularity
4. Search suggestions appear in the search bar

## Benefits

1. **Dynamic Content**: All search data is now managed through Firebase
2. **Real-time Updates**: Changes in admin panel reflect immediately
3. **Scalable**: Easy to add more search features
4. **Analytics**: Can track search patterns and popularity
5. **User Experience**: Personalized search history and trending suggestions

## Technical Notes

- All Firebase functions include error handling and fallback data
- Search results are filtered and sorted appropriately
- Loading states are implemented for better UX
- Data is cached to reduce Firebase calls
- Search functionality includes product name, category, subcategory, description, and features 