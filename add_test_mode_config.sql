
-- Add Test Mode configuration to admin_config
INSERT INTO public.admin_config (key, value, description)
VALUES (
    'test_mode_enabled', 
    '{"enabled": false}', 
    'Si está habilitado, los pagos en el checkout se simulan como exitosos y las órdenes se crean directamente sin pasar por una pasarela real.'
)
ON CONFLICT (key) DO NOTHING;
