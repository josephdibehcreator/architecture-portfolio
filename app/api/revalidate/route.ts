import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * On-demand ISR revalidation endpoint.
 *
 * Called by the backend after admin content changes:
 *   GET/POST /api/revalidate?tag=blogs&secret=<REVALIDATION_SECRET>
 *   GET/POST /api/revalidate?path=/&secret=<REVALIDATION_SECRET>   (structural pages)
 *
 * The secret must match REVALIDATION_SECRET (set in Vercel project settings
 * and the backend environment). Requests are rejected when the secret is not
 * configured, so a missing env var can never open the endpoint.
 */
export const dynamic = 'force-dynamic'

const ALLOWED_TAGS = ['projects', 'blogs', 'news', 'testimonials', 'homepage-stats', 'careers']

const MAX_PATH_LENGTH = 2048

async function handle(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATION_SECRET
  if (!secret) {
    console.error(
      '[revalidate] REVALIDATION_SECRET is not configured — rejecting request. ' +
        'Set it in the frontend environment (Vercel project settings).'
    )
    return NextResponse.json(
      { success: false, message: 'Revalidation is not configured' },
      { status: 500 }
    )
  }

  const providedSecret = request.nextUrl.searchParams.get('secret')
  if (providedSecret !== secret) {
    return NextResponse.json({ success: false, message: 'Invalid secret' }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')
  const path = request.nextUrl.searchParams.get('path')

  if (!tag && !path) {
    return NextResponse.json(
      { success: false, message: 'Missing required query parameter: tag or path' },
      { status: 400 }
    )
  }

  if (tag && !ALLOWED_TAGS.includes(tag)) {
    return NextResponse.json(
      { success: false, message: `Invalid tag. Allowed tags: ${ALLOWED_TAGS.join(', ')}` },
      { status: 400 }
    )
  }

  // revalidatePath expects an in-app path, never a full URL or protocol-relative hop
  if (path && (!path.startsWith('/') || path.length > MAX_PATH_LENGTH)) {
    return NextResponse.json(
      { success: false, message: 'Invalid path. It must start with "/" and be an internal route' },
      { status: 400 }
    )
  }

  const revalidated: string[] = []
  if (tag) {
    revalidateTag(tag)
    revalidated.push(`tag:${tag}`)
  }
  if (path) {
    revalidatePath(path)
    revalidated.push(`path:${path}`)
  }

  return NextResponse.json({
    success: true,
    message: `Revalidated ${revalidated.join(', ')}`,
    revalidatedAt: new Date().toISOString(),
  })
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}
