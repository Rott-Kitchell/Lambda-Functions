/*"is_this_an_influential_brand_": "No",
    "operator_located_in_new_market_": "Yes",
    "how_many_units_associated_with_this_venue_": "1 location",
    "is_this_a_lead_associated_with_a_new_partner_": "No",
    "is_the_operator_piloting_a_new_service_offering_": "Yes",
    "is_the_operator_associated_with_a_key_influencer_or_investor_": "No",
    "does_this_operator_have_the_potential_to_process__75_000_month_with_gotab_": "Yes"*/

export default function priortityCalculator(questions) {
  let counter = 0;
  if (
    questions.is_this_an_influential_brand &&
    questions.is_this_an_influential_brand == "Yes"
  )
    counter = counter + 5;
  if (
    questions.does_this_operator_have_the_potential_to_process__75_000_month_with_gotab_ &&
    questions.does_this_operator_have_the_potential_to_process__75_000_month_with_gotab_ ==
      "Yes"
  )
    counter = counter + 5;
  if (
    questions.is_the_operator_associated_with_a_key_influencer_or_investor_ &&
    questions.is_the_operator_associated_with_a_key_influencer_or_investor_ ==
      "Yes"
  )
    counter = counter + 3;
  if (
    questions.is_the_operator_piloting_a_new_service_offering_ &&
    questions.is_the_operator_piloting_a_new_service_offering_ == "Yes"
  )
    counter = counter + 3;
  if (
    questions.is_this_a_lead_associated_with_a_new_partner_ &&
    questions.is_this_a_lead_associated_with_a_new_partner_ == "Yes"
  )
    counter = counter + 2;
  if (
    questions.operator_located_in_new_market_ &&
    questions.operator_located_in_new_market_ == "Yes"
  )
    counter = counter + 3;
  if (questions.how_many_units_associated_with_this_venue_) {
    let ans = parseInt(
      questions.how_many_units_associated_with_this_venue_.split("")[0]
    );
    if (ans <= 3) {
      counter = counter + 2;
    } else if (ans >= 7) {
      counter = counter + 6;
    } else {
      counter = counter + 4;
    }
  }
  if (counter <= 2) return "Standard";
  if (counter >= 9) return "Strategic";
  return "Growth";
}
