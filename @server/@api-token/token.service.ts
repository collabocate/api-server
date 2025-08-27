import { notFoundErr } from '@lib/errors/Errors';
import { TokenModel as Token, TokenDocument } from '@token/token.model';
import { UserModel as User } from '@user/user.model';

export const createTokenService = async (user_id: string, requestBody: TokenDocument): Promise<TokenDocument> => {
  const user = await User.findById(user_id).exec();
  if(!user){
    notFoundErr('No record found for provided User ID');
  }

  const createToken = new Token({
    token: requestBody.token,
    type: requestBody.type,
    issuer: requestBody.issuer,
    user: user
  });

  const token = await createToken.save();
  
  user.tokens.push(token)
  await user.save()
  
  return token;
};

export const getAllTokenService = async () => {
  const query = await Token.find().exec();
  return query;
}

export const getTokenService = async (user_id: string) => {
  const query = await Token.find({user:{_id: user_id}}).exec();
  return query;
}

export const getOneTokenService = async (user_id: string, paramsId: string) => {
  const query = await Token.findOne({ _id: paramsId, user: user_id }).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }
  return query;
}