import { PageHolder,Login, ResetPassword} from "@page.object";


export class Application extends PageHolder {
            public login = new Login(this.page);
      public resetPassword = new ResetPassword(this.page);

}
