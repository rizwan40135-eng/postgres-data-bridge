create table if not exists items (
  id serial primary key,
  name varchar(100) not null unique,
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now()
);
