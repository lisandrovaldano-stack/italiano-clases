-- Ejecutar DESPUÉS de que María Verónica se registre una vez en /login (creando su usuario).
-- Reemplazá el email por el real antes de correrlo.

update public.profiles
set role = 'teacher', full_name = 'María Verónica Salinas'
where id = (select id from auth.users where email = 'veritusalinas@gmail.com');
