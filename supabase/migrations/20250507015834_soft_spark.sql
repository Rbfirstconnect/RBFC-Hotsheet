/*
  # Add phone specifications
  
  1. Changes
    - Add specifications data to phone_details table
    - Update existing phones with their specifications
*/

-- Update iPhone specifications
UPDATE phone_details
SET specifications = jsonb_build_object(
  'display', jsonb_build_object(
    'Type', CASE 
      WHEN name LIKE '%15 Pro%' OR name LIKE '%16 Pro%' THEN 'LTPO Super Retina XDR OLED'
      WHEN name LIKE '%15%' OR name LIKE '%16%' THEN 'Super Retina XDR OLED'
      WHEN name LIKE '%13%' OR name LIKE '%14%' THEN 'Super Retina XDR OLED'
      ELSE 'Liquid Retina IPS LCD'
    END,
    'Size', screen_size || ' inches',
    'Resolution', CASE 
      WHEN name LIKE '%Pro Max%' THEN '2796 x 1290 pixels'
      ELSE '2556 x 1179 pixels'
    END,
    'Features', CASE 
      WHEN name LIKE '%Pro%' THEN 'ProMotion, Always-On display, HDR10, Dolby Vision'
      ELSE 'HDR10, Dolby Vision'
    END
  ),
  'camera', jsonb_build_object(
    'Main', CASE 
      WHEN name LIKE '%Pro%' THEN '48 MP (wide) + 12 MP (ultrawide) + 12 MP (telephoto)'
      ELSE 'Dual 12 MP (wide + ultrawide)'
    END,
    'Features', CASE 
      WHEN name LIKE '%Pro%' THEN 'Dual-pixel PDAF, sensor-shift OIS, 3x optical zoom'
      ELSE 'Dual-pixel PDAF, sensor-shift OIS'
    END,
    'Video', CASE 
      WHEN name LIKE '%Pro%' THEN '4K@24/30/60fps, ProRes, Cinematic mode'
      ELSE '4K@24/30/60fps, HDR with Dolby Vision'
    END,
    'Selfie', '12 MP, f/2.2'
  ),
  'battery', jsonb_build_object(
    'Type', CASE 
      WHEN name LIKE '%Pro Max%' THEN 'Li-Ion 4422 mAh'
      WHEN name LIKE '%Pro%' THEN 'Li-Ion 3274 mAh'
      WHEN name LIKE '%Plus%' THEN 'Li-Ion 4383 mAh'
      ELSE 'Li-Ion 3279 mAh'
    END,
    'Charging', '20W wired, 15W MagSafe wireless',
    'Features', 'Fast charging, Qi wireless charging'
  )
)
WHERE brand = 'Apple';

-- Update Samsung specifications
UPDATE phone_details
SET specifications = jsonb_build_object(
  'display', jsonb_build_object(
    'Type', CASE 
      WHEN name LIKE '%Ultra%' THEN 'Dynamic AMOLED 2X, 120Hz, HDR10+'
      WHEN name LIKE '%S24%' OR name LIKE '%S25%' THEN 'Dynamic AMOLED 2X, 120Hz'
      ELSE 'Super AMOLED, 90Hz'
    END,
    'Size', screen_size || ' inches',
    'Resolution', CASE 
      WHEN name LIKE '%Ultra%' THEN '3088 x 1440 pixels'
      WHEN name LIKE '%Plus%' OR name LIKE '%+%' THEN '2340 x 1080 pixels'
      ELSE '2400 x 1080 pixels'
    END,
    'Features', CASE 
      WHEN name LIKE '%Ultra%' OR name LIKE '%S24%' OR name LIKE '%S25%' 
      THEN 'Always-on display, HDR10+, 1750 nits peak'
      ELSE 'HDR10+, 800 nits peak'
    END
  ),
  'camera', jsonb_build_object(
    'Main', CASE 
      WHEN name LIKE '%Ultra%' THEN '200 MP (wide) + 12 MP (ultrawide) + 10 MP (telephoto) + 10 MP (periscope)'
      WHEN name LIKE '%S24%' OR name LIKE '%S25%' THEN '50 MP (wide) + 12 MP (ultrawide) + 10 MP (telephoto)'
      ELSE '50 MP (wide) + 12 MP (ultrawide) + 5 MP (macro)'
    END,
    'Features', CASE 
      WHEN name LIKE '%Ultra%' THEN 'Dual Pixel PDAF, OIS, 10x optical zoom'
      WHEN name LIKE '%S24%' OR name LIKE '%S25%' THEN 'Dual Pixel PDAF, OIS, 3x optical zoom'
      ELSE 'PDAF, OIS'
    END,
    'Video', CASE 
      WHEN name LIKE '%Ultra%' OR name LIKE '%S24%' OR name LIKE '%S25%' 
      THEN '8K@24/30fps, 4K@60fps, HDR10+'
      ELSE '4K@30fps, 1080p@60fps'
    END,
    'Selfie', CASE 
      WHEN name LIKE '%Ultra%' THEN '12 MP, f/2.2, Dual Pixel PDAF'
      ELSE '12 MP, f/2.2'
    END
  ),
  'battery', jsonb_build_object(
    'Type', CASE 
      WHEN name LIKE '%Ultra%' THEN 'Li-Ion 5000 mAh'
      WHEN name LIKE '%Plus%' OR name LIKE '%+%' THEN 'Li-Ion 4900 mAh'
      WHEN name LIKE '%S24%' OR name LIKE '%S25%' THEN 'Li-Ion 4000 mAh'
      ELSE 'Li-Ion 5000 mAh'
    END,
    'Charging', CASE 
      WHEN name LIKE '%Ultra%' OR name LIKE '%S24%' OR name LIKE '%S25%' 
      THEN '45W wired, 15W wireless'
      ELSE '25W wired, 15W wireless'
    END,
    'Features', 'Fast charging, Wireless charging, Reverse wireless charging'
  )
)
WHERE brand = 'Samsung';

-- Update Motorola specifications
UPDATE phone_details
SET specifications = jsonb_build_object(
  'display', jsonb_build_object(
    'Type', CASE 
      WHEN name LIKE '%Edge+%' THEN 'P-OLED, 165Hz'
      WHEN name LIKE '%Edge%' THEN 'P-OLED, 144Hz'
      ELSE 'IPS LCD, 90Hz'
    END,
    'Size', screen_size || ' inches',
    'Resolution', '2400 x 1080 pixels',
    'Features', CASE 
      WHEN name LIKE '%Edge%' THEN 'HDR10+, 1200 nits peak'
      ELSE 'HDR10, 500 nits peak'
    END
  ),
  'camera', jsonb_build_object(
    'Main', CASE 
      WHEN name LIKE '%Edge+%' THEN '50 MP (wide) + 50 MP (ultrawide) + 12 MP (telephoto)'
      WHEN name LIKE '%Edge%' THEN '50 MP (wide) + 13 MP (ultrawide) + 2 MP (macro)'
      ELSE '50 MP (wide) + 8 MP (ultrawide) + 2 MP (macro)'
    END,
    'Features', CASE 
      WHEN name LIKE '%Edge%' THEN 'PDAF, OIS'
      ELSE 'PDAF'
    END,
    'Video', CASE 
      WHEN name LIKE '%Edge%' THEN '4K@60fps, 1080p@60fps'
      ELSE '1080p@60fps'
    END,
    'Selfie', CASE 
      WHEN name LIKE '%Edge%' THEN '32 MP, f/2.4'
      ELSE '16 MP, f/2.2'
    END
  ),
  'battery', jsonb_build_object(
    'Type', CASE 
      WHEN name LIKE '%Edge+%' THEN 'Li-Po 4800 mAh'
      WHEN name LIKE '%Edge%' THEN 'Li-Po 4400 mAh'
      ELSE 'Li-Po 5000 mAh'
    END,
    'Charging', CASE 
      WHEN name LIKE '%Edge%' THEN '68W wired, 15W wireless'
      ELSE '20W wired'
    END,
    'Features', CASE 
      WHEN name LIKE '%Edge%' THEN 'Fast charging, Wireless charging'
      ELSE 'Fast charging'
    END
  )
)
WHERE brand = 'Motorola';

-- Update other brands specifications
UPDATE phone_details
SET specifications = jsonb_build_object(
  'display', jsonb_build_object(
    'Type', 'IPS LCD',
    'Size', screen_size || ' inches',
    'Resolution', '1600 x 720 pixels',
    'Features', '400 nits peak'
  ),
  'camera', jsonb_build_object(
    'Main', '13 MP (wide) + 2 MP (depth)',
    'Features', 'PDAF',
    'Video', '1080p@30fps',
    'Selfie', '5 MP, f/2.2'
  ),
  'battery', jsonb_build_object(
    'Type', 'Li-Po 4000 mAh',
    'Charging', '10W wired',
    'Features', 'Fast charging'
  )
)
WHERE brand IN ('Celero', 'Summit', 'TCL');