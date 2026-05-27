-- Database seed migration file
INSERT INTO segment_registry (id, name, category, enabled) VALUES
('style_supportive', 'Style: Supportive Preset', 'style', true),
('style_analytical', 'Style: Analytical Preset', 'style', true),
('bangalore_urban', 'Regional: Bangalore Urban', 'regional', true),
('india_genz', 'Demographic: India Gen Z', 'demographic', true),
('mode_financial_anxiety', 'Mode: Financial Anxiety Trigger', 'contextual', true);

INSERT INTO safety_shields (id, name, target_primitive, threshold, condition) VALUES
('gov_anxiety_warmth', 'Anxiety Warmth Cap', 'warmth', 0.9, 'anxietyLevel == high'),
('gov_advice_assertive', 'Advice Directness/Assertive Cap', 'assertiveness', 0.54, 'upiUsage == heavy'),
('gov_humor_sensitive', 'Humor Clamp in Crisis', 'humor', 0.22, 'anxietyLevel == high'),
('gov_absolute_checkins', 'Absolute Follow-through Cap', 'accountability_pressure', 0.62, 'always');