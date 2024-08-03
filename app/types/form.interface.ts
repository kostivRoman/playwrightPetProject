export type UserRegistrationForm = {
	brandName?: string;
	formType?: string;
	name: boolean; // Name and Surname
	email: boolean; // Email
	password: boolean; // Password
	country: boolean; // Country
	currency: boolean; // Currency
	phoneNumber: boolean; // Phone
	promoHidden: boolean; // Hidden Promo Code
	promoOpen: boolean; // Open Promo Code
	promoCodeText: boolean; // Promo Code Text
	banner: boolean; // Small Banner on Registration Form
	desktopBanner?: boolean; // Desktop Version
};

export interface Brand {
	name: string;
	short: UserRegistrationForm;
	long: UserRegistrationForm;
}
