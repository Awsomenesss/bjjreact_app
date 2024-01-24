import { rest } from "msw";


const baseURL =  "https://pp5-bjj-api-2269f4220822.herokuapp.com/";

export const handlers =[
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
          ctx.json({
            "pk": 2,
            "username": "account1",
            "email": "",
            "first_name": "",
            "last_name": "",
            "profile_id": 2,
            "profile_image": "https://res.cloudinary.com/dveqnj2zy/image/upload/v1/media/images/astrobjj_tfnbgz"
            })
        );
      }),
      rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
      }),
    ];
