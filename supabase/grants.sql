-- Run AFTER schema.sql. Newer Supabase projects do not auto-grant table privileges to the API roles.
-- RLS policies (in schema.sql) still decide which rows each user can touch.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

grant select, insert, update, delete on public.assets, public.events, public.incidents,
  public.detections, public.ioc_watchlist, public.reports, public.notifications to authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, company) on public.profiles to authenticated;

-- API keys are created server-side only (so plan gating cannot be bypassed). Users may list and revoke.
grant select on public.api_keys to authenticated;
grant update (revoked) on public.api_keys to authenticated;

grant select on public.payments to authenticated;
grant insert on public.contact_messages to anon, authenticated;

grant execute on function public.consume_ai_credit() to authenticated;
grant execute on function public.refund_ai_credit() to authenticated;
