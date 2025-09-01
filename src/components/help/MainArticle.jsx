import Link from "next/link";

const MainArticle = () => {
  return (
    <article className="lg:w-3/4">
      <div className="">
        <header>
          <h1 className="text-2xl font-bold mb-4">
            How to Set Up Delivery Information for your Listings
          </h1>
        </header>
        <section className="prose max-w-none">
          <p>
            Etsy offers many delivery tools to help you set postage rates in
            your shop.
          </p>
          <ul>
            <li>
              Use delivery profiles if you have multiple listings with the same
              delivery settings.
            </li>
            <li>
              Offer discounted postage when buyers purchase multiple items.
            </li>
            <li>Offer buyers the option to pay more for faster delivery.</li>
          </ul>
          <div>
            <strong>Jump to a section:</strong>
            <ul>
              <li>
                <a href="#postage-charge" className="hover:underline">
                  How much should I charge for postage?
                </a>
              </li>
              <li>
                <a href="#add-postage" className="hover:underline">
                  How do I add postage rates?
                </a>
              </li>
              <li>
                <a href="#delivery-profile" className="hover:underline">
                  How do I create a delivery profile?
                </a>
              </li>
              <li>
                <a href="#free-delivery" className="hover:underline">
                  How do I offer free delivery?
                </a>
              </li>
              <li>
                <a href="#multiple-items" className="hover:underline">
                  What if someone purchases multiple items from my shop?
                </a>
              </li>
              <li>
                <a href="#delivery-upgrade" className="hover:underline">
                  How do I add delivery upgrade?
                </a>
              </li>
            </ul>
          </div>
          <h2 id="postage-charge">How much should I charge for postage?</h2>
          <p>
            We’ve updated how postage price is factored into Etsy search for US
            domestic listings for physical items only. This means that listings
            with postage prices lower than $6 will be prioritised in Etsy
            search, with some exceptions.
          </p>
          <p>
            To see which types of listings are exempt from this, and to learn
            how to edit your domestic listing postage prices in bulk, view our
            article on postage price search visibility.
          </p>
          <p>
            US sellers can use the Etsy Postage Calculator to determine rates
            with USPS or FedEx.
          </p>
          <p>
            US or Canada sellers can use calculated postage if you dispatch with
            USPS or Canada Post. Enter the weight and dimensions of the item and
            select the delivery services you want to offer. When a buyer enters
            their address and chooses a service, Etsy will calculate the postage
            and add it to the cost of the order.
          </p>
          <p>
            If you live in another country or don’t want to use calculated
            postage, you can add your own postage rates to your listings.
          </p>
          <p>
            You determine your own postage rates, but the Seller Handbook can
            help guide you.
          </p>
          <p>
            Get tips and advice from other sellers in the All About Delivery
            section of the Etsy Forums.
          </p>
          <h2 id="bulky-items">What if I sell very bulky or heavy items?</h2>
          <p>
            If you sell very heavy items, like furniture, consider mentioning in
            your listing descriptions that postage prices vary. Ask buyers to
            contact you before checking out for a postage quote. Then, create a
            custom listing for your buyer.
          </p>
          <p>Learn how to create a custom listing.</p>
          <h2 id="add-postage">How do I add postage rates?</h2>
          <p>
            If you don't want to use calculated postage, add postage rates when
            creating or editing a listing. Be sure to set a rate for each
            country where you'd like to deliver items. Many buyers only see Etsy
            listings that are delivered to their country.
          </p>
          <p>
            <strong>To add delivery when creating a listing:</strong>
          </p>
          <h2 id="delivery-profile">How do I create a delivery profile?</h2>
          <p>
            To reuse the same delivery settings on multiple items, apply a
            delivery profile. If you edit a delivery profile, it will update on
            every listing you’ve applied it to.
          </p>
          <p>
            Save a delivery profile after adding postage rates to a listing, or
            use the Delivery profiles page to create and manage your profiles.
          </p>
          <p>
            <strong>To create a delivery profile:</strong>
          </p>
          <p>
            <strong>To add a delivery profile to a listing:</strong>
          </p>
          <h2 id="free-delivery">How do I offer free delivery?</h2>
          <p>
            Free delivery can be an important tactic to entice buyers to
            complete a purchase. Learn more about offering free delivery.
          </p>
          <p>
            If you use calculated postage, scroll down to the Free delivery
            section of a delivery profile. Specify whether you'd like to offer
            domestic or international free delivery by checking the appropriate
            boxes.
          </p>
          <p>
            For delivery profiles, select Free delivery from the What you’ll
            charge dropdown.
          </p>
          <h2 id="multiple-items">
            What if someone purchases multiple items from my shop?
          </h2>
          <p>
            When you set fixed postage rates, you can offer discounted postage
            for multiple items when you add a rate for One item and an
            Additional item.
          </p>
          <p>
            <strong>One item price:</strong> The cost of delivering the item
            alone.
          </p>
          <p>
            <strong>Additional item price:</strong> The cost of delivering this
            item when added to an additional item in your shop. This could be
            either a different listing in your shop or more than one of the same
            item.
          </p>
          <p>
            To calculate the postage rate, Etsy takes the listing with the most
            expensive One item price and then adds each Additional item price.
          </p>
          <table className="table-auto border-collapse border border-gray-300 my-4">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">One item</th>
                <th className="border border-gray-300 px-2 py-1">
                  Additional item
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">
                  Item A: 2.00 USD
                </td>
                <td className="border border-gray-300 px-2 py-1">0.50 USD</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">
                  Item B: 1.00 USD
                </td>
                <td className="border border-gray-300 px-2 py-1">0.75 USD</td>
              </tr>
            </tbody>
          </table>
          <p>
            If a buyer purchases Item A and Item B, the total postage is 2.75
            USD. We’ll take Item A’s One item price of 2.00 USD, since it’s most
            expensive, and Item B’s Additional item price of 0.75 USD.
          </p>
          <p>
            If three Item A are purchased, the total postage would be 3.00 USD.
            We’ll take the One item cost of 2.00 USD and add two Additional item
            costs of 0.50 USD each.
          </p>
          <h2 id="calculated-postage">If you offer calculating postage</h2>
          <p>
            It isn't possible to set discounted rates for listings with
            calculated postage. For fixed rate items, the discounted rates are
            helpful because you can approximate what it would cost to deliver
            multiple items. You don’t need that with calculated postage, because
            the precise cost of delivering multiple items is calculated for you.
          </p>
          <p>
            If some of your listings have fixed rates and others have calculated
            postage, we first add the calculated postage on those listings in
            the order as normal. For the fixed rate listings, we’ll add your
            Additional item rates.
          </p>
          <h2 id="delivery-upgrade">How do I add delivery upgrade?</h2>
          <p>
            You can offer your buyers delivery upgrade so they can opt for
            faster delivery at checkout.
          </p>
          <p>
            If you’re in the US or Canada and offer calculated postage, delivery
            upgrades are available based on which delivery services you’ve
            chosen to offer in your calculated postage settings.
          </p>
          <p>
            Otherwise you can enable delivery upgrades as part of setting fixed
            rates.
          </p>
          <p>
            <strong>To enable delivery upgrades from your Shop Manager:</strong>
          </p>
          <p>
            <strong>To add delivery upgrades to a delivery profile:</strong>
          </p>
          <h2 id="charge-upgrade">
            How are buyers charged for delivery upgrades?
          </h2>
          <p>The upgrade price is added to the initial item cost you set.</p>
          <p>
            When adding delivery upgrades, you can enter either a Domestic
            upgrade, an International upgrade, or both.
          </p>
          <p>
            In an order for multiple items, if a delivery upgrade is available
            on one item, it will be available for the buyer to select. The cost
            will apply to every item in the order, even for items whose delivery
            profiles don't offer the upgrade.
          </p>
          <p>
            <strong>Did this resolve the issue?</strong>
          </p>
        </section>
      </div>

      {/* Related Articles Section */}
      <section className="mt-8">
        <div className="">
          <h3 className="text-xl font-bold mb-4">Related articles</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>
              <Link
                href="/hc/articles/how-to-set-up-calculated-postage"
                className="hover:underline"
              >
                How to Set Up Calculated Postage
              </Link>
            </li>
            <li>
              <Link
                href="/hc/articles/how-to-deliver-your-items"
                className="hover:underline"
              >
                How to Deliver Your Items on Etsy
              </Link>
            </li>
            <li>
              <Link
                href="/hc/articles/how-to-offer-free-delivery"
                className="hover:underline"
              >
                How to Offer Free Delivery
              </Link>
            </li>
            <li>
              <Link
                href="/hc/articles/what-is-a-payment-account-reserve"
                className="hover:underline"
              >
                What is a Payment Account Reserve?
              </Link>
            </li>
            <li>
              <Link
                href="/hc/articles/customs-information-for-international-delivery"
                className="hover:underline"
              >
                Customs Information for International Delivery
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default MainArticle;
