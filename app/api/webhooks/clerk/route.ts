import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { upsertUser, deleteUserByClerkId } from '@/lib/db/queries/users';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.warn('[Clerk Webhook Warning]: CLERK_WEBHOOK_SECRET is not set in .env.local');
    return new Response('Error: Please add CLERK_WEBHOOK_SECRET to .env.local', {
      status: 500,
    });
  }

  // Get Svix headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get payload body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as unknown as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;

    const primaryEmail =
      email_addresses?.find((e) => e.id === evt.data.primary_email_address_id)?.email_address ||
      email_addresses?.[0]?.email_address ||
      '';

    const name = [first_name, last_name].filter(Boolean).join(' ') || username || 'Developer';

    await upsertUser({
      clerkId: id,
      email: primaryEmail,
      name,
      username: username || `user_${id.slice(-8)}`,
      avatarUrl: image_url || null,
      onboardingComplete: false,
    });

    console.log(`[Clerk Webhook] Successfully synced user ${id} (${eventType})`);
  } else if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (id) {
      await deleteUserByClerkId(id);
      console.log(`[Clerk Webhook] Successfully deleted user ${id}`);
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
