import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { TableClient, TableServiceClient } from '@azure/data-tables'

const TABLE_NAME = 'bottles'

// Get table client (creates table if not exists)
async function getTableClient(): Promise<TableClient> {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set')
  }

  const serviceClient = TableServiceClient.fromConnectionString(connectionString)

  // Create table if it doesn't exist
  try {
    await serviceClient.createTable(TABLE_NAME)
  } catch (error: unknown) {
    // Table already exists - ignore error
    const err = error as { statusCode?: number }
    if (err.statusCode !== 409) {
      throw error
    }
  }

  return TableClient.fromConnectionString(connectionString, TABLE_NAME)
}

// Entity type for Azure Table
interface BottleEntity {
  partitionKey: string
  rowKey: string
  city: string
  country: string
  lat: number
  lng: number
  distanceKm: number
  carbonGrams: number
  submittedAt: string
}

export const Route = createFileRoute('/api/bottles')({
  server: {
    handlers: {
      // GET - Fetch all bottles
      GET: async () => {
        try {
          const tableClient = await getTableClient()
          const bottles: BottleEntity[] = []

          const entities = tableClient.listEntities<BottleEntity>({
            queryOptions: { filter: "PartitionKey eq 'submission'" },
          })

          for await (const entity of entities) {
            bottles.push({
              partitionKey: entity.partitionKey,
              rowKey: entity.rowKey,
              city: entity.city,
              country: entity.country,
              lat: entity.lat,
              lng: entity.lng,
              distanceKm: entity.distanceKm,
              carbonGrams: entity.carbonGrams,
              submittedAt: entity.submittedAt,
            })
          }

          // Transform to frontend format
          const submissions = bottles.map((b) => ({
            id: b.rowKey,
            city: b.city,
            country: b.country,
            lat: b.lat,
            lng: b.lng,
            distanceKm: b.distanceKm,
            carbonGrams: b.carbonGrams,
            submittedAt: b.submittedAt,
          }))

          return json(submissions)
        } catch (error) {
          console.error('Error fetching bottles:', error)
          return json({ error: 'Failed to fetch bottles' }, { status: 500 })
        }
      },

      // POST - Add a new bottle
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json()
          const { id, city, country, lat, lng, distanceKm, carbonGrams, submittedAt } = body

          if (!city || !country || lat === undefined || lng === undefined) {
            return json({ error: 'Missing required fields' }, { status: 400 })
          }

          const tableClient = await getTableClient()

          const entity: BottleEntity = {
            partitionKey: 'submission',
            rowKey: id || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            city,
            country,
            lat,
            lng,
            distanceKm,
            carbonGrams,
            submittedAt: submittedAt || new Date().toISOString(),
          }

          await tableClient.createEntity(entity)

          return json({
            id: entity.rowKey,
            city: entity.city,
            country: entity.country,
            lat: entity.lat,
            lng: entity.lng,
            distanceKm: entity.distanceKm,
            carbonGrams: entity.carbonGrams,
            submittedAt: entity.submittedAt,
          })
        } catch (error) {
          console.error('Error creating bottle:', error)
          return json({ error: 'Failed to create bottle' }, { status: 500 })
        }
      },

      // DELETE - Remove a bottle
      DELETE: async ({ request }: { request: Request }) => {
        try {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')

          if (!id) {
            return json({ error: 'Missing bottle id' }, { status: 400 })
          }

          const tableClient = await getTableClient()
          await tableClient.deleteEntity('submission', id)

          return json({ success: true })
        } catch (error) {
          console.error('Error deleting bottle:', error)
          return json({ error: 'Failed to delete bottle' }, { status: 500 })
        }
      },
    },
  },
})
