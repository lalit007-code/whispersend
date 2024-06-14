import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    console.log(username);

    const decodedUsername = decodeURIComponent(username);
    console.log(decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    console.log(user);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Email verified Successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code has expired , please signUp again to get a new one",
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.log("Error Verifying code", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying Code",
      },
      {
        status: 500,
      }
    );
  }
}
