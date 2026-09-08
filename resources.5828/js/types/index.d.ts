export interface User {
    id: number;
    name: string;
    email: string;
    surname: string;
    email_verified_at: string | null;
    copy_password: string;
    role: string;
    created_at: string; // You can use Date if you want to handle it as a Date object
    updated_at: string; // You can use Date if you want to handle it as a Date object
}

export interface Item {
    id: number;
    name: string;
    price: number;
    created_at: string; // You can use Date if you want to handle it as a Date object
    updated_at: string;
    resident: Resident; // You can use Date if you want to handle it as a Date object
}
export interface Resident {
    id: number;
    user_id: number;
    phone_number: string;
    gender: string;
    room_id: number;
    number_room: string;
    created_at: string;
    updated_at: string;
    user: User;
    number_plat: string;
    needs: Need[];
    bills: Bill[];
    room: Room;
}

export interface PaymentGatewayProps {
    id: number;
    XENDIT_API_KEY: string;
    XENDIT_CALLBACK_TOKEN: string;
    created_at: string; // atau bisa pakai Date kalau nanti ingin parsing jadi objek Date
    updated_at: string;
}

export interface Need {
    id: number;
    item_id: number;
    resident_id: number;
    created_at: string;
    updated_at: string;
    item: Item;
}
export interface Room {
    id: number;
    number_room: string;
    boarding_branch_id: number;
    residents: Resident[];
    total_bill: number;
}
export interface Punishment {
    id: number;
    price: number;
    max_day: number;
    created_at: string;
    updated_at: string;
}
export interface UserNeed {
    id: number;
    item_id: number;
    resident_id: number;
    created_at: string;
    updated_at: string;
    resident: Resident;
    item: Item;
}

export interface Bill {
    id: number;
    resident_id: number;
    amount: number;
    end_date: string;
    date_invoice: string;
    date_pay: string;
    penalty: number;
    penalty_day: number;
    status: string;
    invoice: string;
    created_at: string;
    updated_at: string;
    subtotal: number;
    resident: Resident;
    detail_bills: DetailBill[];
    payment?: Payment;
}

export interface DetailBill {
    id: number;
    bill_id: number;
    name: string;
    price: number;
    created_at: string;
    updated_at: string;
}

export interface Promo {
    id: number;
    image: string;
}
export interface ContactAdmin {
    phone: string;
    created_at: string;
    id: number;
    name: string;
    updated_at: string;
}

export interface Payment {
    id: number;
    bill_id: number;
    checkout_link: string;
    status: string;
    external_id: string;
    payment_method: string;
    payment_channel: string;
    created_at: string;
    updated_at: string;
}
export interface BoardingBranch {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    room_qty: number;
    created_at: string;
    updated_at: string;
}

export interface Room {
    id: number;
    number_room: string;
    boarding_branch_id: number;
    residents: Resident[];
    total_bill: number;
    item: Item[];
}

interface BoardingService {
    room_qty: number;
}

interface RecordTransaction {
    id: number;
    amount: number;
    boarding_branch_id: number;
    date: string;
    note: string;
    type: string;
    description: string;
    type_record: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success: string;
        error: string;
    };
    items: Item[];
    residents: Resident[];
    promos: Promo[];
    contact: ContactAdmin;
    billActive: any[];
    monthNow: string;
    boarding_branch: BoardingBranch[];
    residentBoardingBranch: Resident[];
    active_boarding_branch: BoardingBranch;
    residentDontHaveRoomInBoardingBranch: Resident[];
    room_qty: BoardingService;
    resident_no_room: Resident[];
};
