module.exports = {
  async webhook(ctx) {
    const event = ctx.request.body;

    // Handle the event
    let user;
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        console.log("Received event:", event);
        console.log("session.client_reference_id", session.client_reference_id);
        const myArray = session.client_reference_id.split("˜");

        const user_id = myArray[0];
        const documentId = myArray[1];
        let amount = Number("0" + myArray[2]);

        let company_id = null;

        // Resolve company_id from documentId
        if (documentId && documentId !== "0" && documentId !== "undefined") {
          const company = await strapi.entityService.findMany("api::company.company", {
            filters: { documentId }, // Assuming `documentId` is a valid field in your company model
            limit: 1,
          });

          if (company.length > 0) {
            company_id = company[0].id;
            console.log("Resolved company_id:", company_id);
          } else {
            console.log("No company found for documentId:", documentId);
          }
        }

        // Handle post-payment logic, e.g., create a purchase in your database
        await strapi.entityService.create("api::purchase.purchase", {
          data: {
            user_id: user_id,
            // @ts-ignore
            company: company_id,
            amount: amount,
            stripe_results: event,
            publishedAt: new Date(),
          },
        });

        let hascompany = true;

        // if (
        //   !company_id ||
        //   company_id === "0" ||
        //   company_id === "undefined" ||
        //   company_id === 0
        // ) {
        //   console.log("company_id", company_id);
        //   hascompany = false;
        // }

        if (!hascompany) {
          console.log("No valid company_id found. Skipping company update." + documentId);
          break;
        } else {
          const company = await strapi.entityService.findOne(
            "api::company.company",
            company_id
          );

          if (company) {

          amount = amount + Number("0" + company.credits);
          console.log("company", company);
          console.log("amount", amount);

          await strapi.entityService
            .update("api::company.company", company_id, {
              data: {
                credits: amount,
              },
              fields: ["credits"],
            })
            .then((result) => {
              console.log("result", result);
            })
            .catch((err) => {
              console.log("err", err);
            });
          } else {
            console.log("Company not found for id:", company_id);
          }
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    ctx.send({ received: true });
  },
};
