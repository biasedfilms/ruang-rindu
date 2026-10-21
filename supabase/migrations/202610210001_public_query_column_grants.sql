-- Public readers filter by publication status and use the generated search
-- document, but neither field is part of the browser response contract.
-- Grant only the privileges required to evaluate those query expressions.
grant select (status, search_document)
on public.letters to anon, authenticated;
