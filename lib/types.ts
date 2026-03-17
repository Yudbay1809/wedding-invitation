export type Invitation = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  theme: string;
  status: string;
  cover_image_url?: string | null;
  show_watermark?: boolean | null;
  published_at: string | null;
  updated_at?: string | null;
  created_at: string;
};

export type RSVP = {
  id: string;
  invitation_id: string;
  name: string;
  whatsapp: string;
  guest_count: number;
  status: "attending" | "declined" | "pending";
  message: string | null;
  created_at: string;
};
