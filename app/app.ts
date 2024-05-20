import { PageHolder, Login, ResetPassword, Buzz } from "@page.object";

export class Application extends PageHolder {
	public login = new Login(this.page);
	public resetPassword = new ResetPassword(this.page);
	public buzz = new Buzz(this.page);
}
