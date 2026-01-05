export type Room = {
    id: string; // uuid
    room_id: string; // user-friendly id
    created_at: string;
    language: string;
};

export type Message = {
    id: string; // uuid
    room_id: string; // foreign key
    user_id: string; // sender
    username: string; // display name (for MVP)
    content: string;
    created_at: string;
};

export type SignalingMessage = {
    id: string;
    room_id: string;
    data: any; // SDP offer/answer/candidate
    from_user: string;
    to_user: string;
    created_at?: string;
};
