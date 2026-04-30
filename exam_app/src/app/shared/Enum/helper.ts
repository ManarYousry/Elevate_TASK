import { ChangePassword } from "../../features/account/components/change-password/change-password";

export class APIs {

  public static readonly Auth= {
    login:"auth/login",
    register:"auth/register",
    forgotPassword:"auth/forgot-password",
    resetPassword:"auth/reset-password",
    sendEmailVerification:"auth/send-email-verification",
    confirmEmailVerification:"auth/confirm-email-verification"

  };

    public static readonly Dashboard= {
    getAllDiplomas:"diplomas",
    getDiplomaById:"diplomas/",
    
  };
  public static readonly Questions= {
   
    getQuestionsByExamId:"questions/exam/",
    
  };
   public static readonly Submittion= {
   
    submitExam:"submissions",
    
  };

   public static readonly Account= {
    userProfile:"users/profile",
    changePassword:"users/change-password",
    changeEmailRequest:"users/email/request",
    confirmEmailChange:"users/email/confirm",
    deleteAccount:"users/account"
    
  };

}
