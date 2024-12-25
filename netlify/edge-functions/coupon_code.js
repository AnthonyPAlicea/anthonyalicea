import {
	EleventyEdge,
	precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

export default async (request, context) => {

  // Just return what was requested without transforming it, 
  // unless we fnd the coupon code query parameter
  const url = new URL(request.url);
  let coupon_code = null;
  if (!url.searchParams.get("coupon_code")) {
    return;
  } else {
    coupon_code = url.searchParams.get("coupon_code");
  }

  // Get the page content
  const response = await context.next();
  const page = await response.text();

  // Search for the placeholder
  const regex1 = /SET_PRICE/i;
  const regex2 = /LIST_PRICE/i;

  // Coupons
  const coupons = [
    { code: 'EARLYBIRD', type:'I', newPrice: "900" },
    { code: 'NORMAL24', type:'I', newPrice: "19.99" }
];

let price = "49.99";

// Check if any coupon code is present in the query parameters and update the price
let foundCoupon = false;
coupons.forEach(coupon => {
    if (coupon_code === coupon.code) {
        price = coupon.newPrice;
        foundCoupon = true;
    }
});

if (!foundCoupon) return;

price = price + "&nbsp;<s>$79.99</s>"


  // Replace the content
  const updatedPage1 = page.replace(regex1, "YesSetPrice");
  const updatedPage2 = updatedPage1.replace(regex2, price);
  return new Response(updatedPage2, response);
};