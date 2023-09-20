import { parse } from 'cookie';
import type { Handle } from '@sveltejs/kit';
import { verifier } from '$lib/cognito';

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const { headers } = event.request;
        const cookies = parse(headers.get('cookie') ?? '');
        const payload = await verifier.verify(cookies.jwt, {
            clientId: import.meta.env.VITE_USER_POOL_CLIENT_ID
        });
        event.locals.userId = payload.sub;
    } catch (e) {
        if (
            ['/compte-patient'].includes(event.url.pathname)
        ) {
            return new Response('Redirect', {
                status: 303,
                headers: { Location: '/rendez-vous' }
            });
        }
    }
    return await resolve(event);
};