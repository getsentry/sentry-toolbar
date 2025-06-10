# Sentry Dev Toolbar - Logs Feature Implementation

## Overview

I have successfully extended the Sentry dev toolbar to support the new Logs feature. The implementation follows the existing patterns used for Issues and Feedback panels, providing a consistent user experience.

## Implementation Details

### 1. New Components Created

#### `IconLogs.tsx`
- **Location**: `src/lib/components/icon/IconLogs.tsx`
- **Purpose**: SVG icon component for the logs feature
- **Design**: Simple document icon with lines representing log entries

#### `LogEntry` Type Definition
- **Location**: `src/lib/sentryApi/types/log.ts`
- **Purpose**: TypeScript interface for log entry data structure
- **Fields**:
  - `sentry.item_id`: Unique log item identifier
  - `project.id`: Project identifier
  - `trace`: Optional trace ID for distributed tracing
  - `severity_number` & `severity`: Log severity levels
  - `timestamp`: Log timestamp
  - `message`: Log message content
  - Additional fields for context and tags

#### `useInfiniteLogsListQuery`
- **Location**: Added to `src/lib/sentryApi/queryKeys.ts`
- **Purpose**: TanStack Query configuration for fetching logs with infinite scrolling
- **API Configuration**:
  - Endpoint: `/organizations/{org}/events/`
  - Dataset: `ourlogs`
  - Fields: All necessary log fields from the API example
  - Pagination: 1000 logs per page
  - Sort: `-timestamp` (newest first)
  - Default period: 24 hours

#### `useInfiniteLogsList` Hook
- **Location**: `src/lib/components/panels/logs/useInfiniteLogsList.ts`
- **Purpose**: Custom hook for fetching infinite logs data
- **Features**:
  - Environment filtering
  - Project filtering
  - Query string support for log filtering

#### `LogListItem` Component
- **Location**: `src/lib/components/panels/logs/LogListItem.tsx`
- **Purpose**: Individual log entry display component
- **Features**:
  - Color-coded severity levels (Error/Critical: red, Warning: yellow, Info: blue, Debug: gray)
  - Timestamp with relative date formatting
  - Log message truncation
  - Project icon and ID display
  - Clickable trace ID linking to performance trace view

#### `LogsPanel` Component
- **Location**: `src/lib/components/panels/logs/LogsPanel.tsx`
- **Purpose**: Main logs panel component
- **Features**:
  - Transaction-based log filtering
  - Infinite scrolling with virtualization
  - Loading states and placeholders
  - Empty state handling
  - Header with Sentry app link integration

### 2. Router Integration

#### Updated `AppRouter.tsx`
- Added import for `LogsPanel`
- Added route: `/logs` → `<LogsPanel />`
- Positioned between feedback and feature flags routes

### 3. Navigation Integration

#### Updated `Navigation.tsx`
- Added import for `IconLogs`
- Added navigation item between User Feedback and Feature Flags
- Includes tooltip: "Logs"
- Uses same styling patterns as other navigation items

## API Integration

The logs functionality integrates with Sentry's logs API using the same endpoint structure as provided in the example:

```
/api/0/organizations/{org}/events/?dataset=ourlogs&field=...&per_page=1000&sort=-timestamp&statsPeriod=24h
```

### Query Parameters
- `dataset=ourlogs`: Specifies logs dataset
- `field[]`: Multiple fields for log data structure
- `per_page=1000`: Large page size for efficient loading
- `sort=-timestamp`: Newest logs first
- `statsPeriod=24h`: Default 24-hour time window
- `referrer=api.explore.logs-table`: Consistent with Sentry's logs table

## User Experience

### Navigation Flow
1. User clicks the "Logs" button in the dev toolbar navigation
2. Panel opens showing logs related to the current page/transaction
3. Logs are filtered by transaction name (similar to Issues and Feedback)
4. Infinite scrolling loads more logs as user scrolls down

### Visual Features
- **Severity Color Coding**: Immediate visual indication of log importance
- **Relative Timestamps**: Easy-to-understand time formatting
- **Message Truncation**: Clean layout with full message visibility
- **Trace Links**: Direct navigation to related performance data
- **Project Context**: Clear project identification

### Responsive Design
- Follows existing toolbar design patterns
- Consistent spacing and typography
- Mobile-friendly layout
- Proper loading and empty states

## Technical Architecture

### Data Flow
1. **Query Initialization**: `useInfiniteLogsList` hook sets up TanStack Query
2. **API Call**: `useInfiniteLogsListQuery` configures the API request
3. **Data Fetching**: Sentry API proxy handles authentication and requests
4. **Component Rendering**: `LogsPanel` manages the list state and rendering
5. **Item Display**: `LogListItem` handles individual log presentation

### Performance Considerations
- **Infinite Scrolling**: Efficient loading of large log datasets
- **Virtualization**: React Virtual handles large lists efficiently
- **Caching**: TanStack Query provides intelligent caching
- **Background Updates**: Automatic refresh of log data

### Error Handling
- Loading states during data fetching
- Empty state when no logs are found
- Error boundaries for robust error handling
- Graceful degradation for API failures

## File Structure

```
src/lib/
├── components/
│   ├── icon/
│   │   └── IconLogs.tsx                    # Logs icon component
│   ├── panels/
│   │   └── logs/
│   │       ├── LogsPanel.tsx               # Main logs panel
│   │       ├── LogListItem.tsx             # Individual log item
│   │       └── useInfiniteLogsList.ts      # Logs data hook
│   ├── AppRouter.tsx                       # Updated with logs route
│   └── Navigation.tsx                      # Updated with logs navigation
├── sentryApi/
│   ├── types/
│   │   └── log.ts                          # Log entry type definitions
│   └── queryKeys.ts                        # Updated with logs query
```

## Testing

The implementation has been validated by:
- ✅ Successful TypeScript compilation
- ✅ Build process completion without errors
- ✅ Consistent code patterns with existing panels
- ✅ Proper import/export structure
- ✅ Type safety maintained throughout

## Future Enhancements

Potential improvements that could be added:
1. **Advanced Filtering**: Log level, time range, and keyword filters
2. **Export Functionality**: Download logs as JSON/CSV
3. **Real-time Updates**: WebSocket integration for live log streaming
4. **Log Grouping**: Group similar log messages
5. **Search**: Full-text search across log messages
6. **Contextual Actions**: Jump to related errors, traces, or releases

## Conclusion

The logs functionality has been successfully integrated into the Sentry dev toolbar, providing developers with easy access to application logs directly from their development environment. The implementation maintains consistency with existing patterns while providing powerful log viewing capabilities.
