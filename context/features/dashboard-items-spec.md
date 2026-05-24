# Dashboard Items Spec

## Overview

Replace the dummy item data displayed in the main area of the dashboard (right side), with actual data from the database. It should look how it does now, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.


## Requirements

- Create src/lib/db/items.ts with data fetching functions
- Fetch items directly in server component
- item card icon/border derived from the item type
- Display item type tags and anything else currently there. You can also reference the screenshot if needed
- Update collection stats display
- It should be marked with a pink heart if it belongs to the favorite collection, with a yellow star if it is a favorite item, and with a pin if it is pinned.
- The UI should no be changed

## References

Check the `@context/screenshots/dashboard-ui-items.JPG` screenshot if needed, but layout and design is already there.
