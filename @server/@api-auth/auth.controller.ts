import { Request, Response, NextFunction } from 'express';
import { error, success } from '@lib/helpers';
import passport from 'passport';
import { UserDocument } from '@server/@api-user/user.model';
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';
dotenv.config();

// const routeName = 'user';
// const item = `${routeName}-item`;

let response: { [key: string]: unknown } = {};

//---------------------- AUTHENTICATION (SIGNUP AND LOGIN) -------------------------------//
export const signupOrLoginWithGithubController = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('github', {
      session: false,
      failureRedirect: `${process.env.APP_SUBDOMAIN_CLIENT_APP_URL}/login?error=AuthenticationError`
    },
    (err: Error, user: UserDocument) => {
      try {
        if (err) {
          // const myErr = new Error("[UNAUTHORIZED] Invalid google user");
          throw err;
        }

        const token = jwt.sign(
          {_id: user._id, email: user.email, role: user.role},
          process.env.JWT_SECRET,
          {expiresIn: process.env.JWT_LIFETIME}
        );

        response = {
          success: true,
          message: `SUCCESS: User signup or login with Github was successfull`,
          data: {
            user: {
              _id: user._id,
              email: user.email,
              email_verified: user.email_verified,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
            token: token
          },
        };
        success(`SUCCESS: User signup or login with Github was successfull`);
        const res_string = JSON.stringify(response);
        res.redirect(`${process.env.APP_SUBDOMAIN_CLIENT_APP_URL}/auth/callback?response=${res_string}`);
        
      } catch (err) {
        error(`error_status: ${err.status || 500}`);
        error(`error_message: ${err.message}`);
        res.redirect(`${process.env.APP_SUBDOMAIN_CLIENT_APP_URL}/login?error=ServerError`);
        next();
      }
  }) (req, res, next)
}

export const signupOrLoginWithGoogleController = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", {session: false},
    (err: Error, user: UserDocument) => {
      try {
        if (err) {
        // const myErr = new Error("[UNAUTHORIZED] Invalid google user");
          throw err;
      }

      const token = jwt.sign(
        {_id: user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
      );

      response = {
      success: true,
      message: `SUCCESS: User signup or login with Google was successfull`,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          email_verified: user.email_verified,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token: token
      },
    };
    success(`SUCCESS: User signup or login with Google was successfull`);

        const res_string = JSON.stringify(response);
        res.redirect(`${process.env.APP_SUBDOMAIN_CLIENT_APP_URL}/auth/callback?response=${res_string}`)
        
      } catch (err) {
        next(err)
      }
  }) (req, res, next)
}

export const signupWithLocalController = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local-signup', {session: false}, 
    (err: Error, user: UserDocument) => {
    try {
      if (err) {
        throw err;
      }

      const token = jwt.sign(
        {_id: user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
      );

      response = {
      success: true,
      message: `SUCCESS: User local-signup was successfull`,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          email_verified: user.email_verified,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token: token
      },
    };
    success(`SUCCESS: User local-signup was successfull`);
    return res.status(201).json(response);

    } catch (err) {
      next(err);
    }
  }) (req, res, next);
}


export const loginWithLocalController = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local-login', {session: false}, 
    (err: Error, user: UserDocument) => {
    try {
      if (err) {
        throw err;
      }

      const token = jwt.sign(
        {_id: user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
      );

      response = {
        success: true,
        message: `SUCCESS: User local-login was successfull`,
        data: { token: token },
      };
      success(`SUCCESS: User local-login was successfull`);
      return res.status(201).json(response);

    } catch (err) {
      next(err);
    }
  }) (req, res, next);
}
//------------------------------------------------------------------------------------------//