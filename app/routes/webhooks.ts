import { verifyWebhook } from '@clerk/react-router/webhooks';
import type { Route } from './+types/webhooks';
import { db } from '~/lib/db';
import { usersTable } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';

export const action = async ({ request }: Route.ActionArgs) => {
  try {
    const event = await verifyWebhook(request);
    const eventType = event.type;

    console.log(
      `Received webhook with ID ${event.data.id} and event type of ${eventType}`
    );

    if (eventType === 'user.created') {
      if (
        !event.data.email_addresses ||
        event.data.email_addresses.length === 0
      ) {
        console.warn('No email address was sent in the webhook');
        return new Response('Email address is required', { status: 400 });
      }

      if (!event.data.first_name || !event.data.last_name) {
        console.warn('No first name or last name was sent in the webhook');
        return new Response('First name and last name are required', {
          status: 400,
        });
      }

      if (!event.data.username) {
        console.warn('No username was sent in the webhook');
        return new Response('Username is required', { status: 400 });
      }

      await db.insert(usersTable).values({
        email: event.data.email_addresses[0].email_address,
        name: `${event.data.first_name} + ${event.data.last_name}`,
        username: event.data.username,
        clerkUserId: event.data.id,
      });
      return new Response('User created successfully', { status: 200 });
    }
    if (eventType === 'user.updated') {
      const clerkUserId = event.data.id;

      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkUserId, clerkUserId))
        .limit(1)
        .execute();

      if (dbUser[0] === undefined) {
        console.warn('No user found in the database with the provided email');
        return new Response('User not found', { status: 404 });
      }

      const name = `${event.data.first_name} + ${event.data.last_name}`;
      const email = event.data.email_addresses[0].email_address;

      await db
        .update(usersTable)
        .set({
          email,
          name,
        })
        .where(eq(usersTable.id, dbUser[0].id));

      return new Response('User updated successfully', { status: 200 });
    }
    if (eventType === 'user.deleted') {
      const clerkUserId = event.data.id;

      if (!clerkUserId) {
        console.warn('No user ID was sent ');
        return new Response('User ID is required to delete a user', {
          status: 400,
        });
      }

      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkUserId, clerkUserId))
        .limit(1)
        .execute();

      if (dbUser[0] === undefined) {
        console.warn('No user found in the database with the provided email');
        return new Response('User not found', { status: 404 });
      }

      await db.delete(usersTable).where(eq(usersTable.id, dbUser[0].id));

      return new Response('User deleted successfully', { status: 200 });
    }

    console.warn(`Unhandled webhook event type: ${eventType}`);
    return new Response('Webhook event not handled', { status: 200 });
  } catch (e) {
    console.error('Error verifying webhook:', e);
    return new Response('Error verifying webhook', { status: 400 });
  }
};
