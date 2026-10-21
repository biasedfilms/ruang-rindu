alter table public.letters
  drop constraint if exists letters_message_length,
  drop constraint if exists letters_display_name_length;

alter table public.letters
  add constraint letters_message_length check (char_length(btrim(message)) between 1 and 5000),
  add constraint letters_display_name_length check (display_name is null or char_length(btrim(display_name)) between 1 and 60);
