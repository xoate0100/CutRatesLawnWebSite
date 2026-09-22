# GA4 setup checklist (owner)

Live GTM already loads measurement ID **G-5X2990G1ZP** (observed 2026-09-22). Confirm this is the intended property.

1. Mark **key events:** `conversion_lead`, `phone_click`
2. Register custom dimensions: `service_id`, `area_slug`, `form_id`, `step_name`, `step_number`, `location`, `traffic_type`, `transaction_id`
3. Data retention: **14 months**
4. Link **Google Ads** and **Search Console**
5. Exclude internal traffic (owner IP filter)
6. Set property ID into Apps Script Script Property `GA4_PROPERTY_ID` for the weekly report
