import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://vvshfuhtoczoppououpl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2c2hmdWh0b2N6b3Bwb3VvdXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTMyMzEsImV4cCI6MjA5MjE2OTIzMX0.oCjnEEpwQ2h3YkfVcqritjGdM-rGgP1_LPLcAQzc580"
);