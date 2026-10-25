# Sourcing bricks for custom house-model kits (Poland/EU, 2026): cost per piece, availability, logistics, quality

Research date: 2026-10-25. Method note: direct page fetching (WebFetch/curl) was blocked by the sandbox network policy (bricklink.com, lego.com, webrick.com and newelementary.com all refused). Every fact below therefore comes from web-search result snippets and summaries of the cited pages. The URLs are the original pages, but figures could not be re-checked on the live page. Treat exact numbers as "reported by source X" and confirm them in a live checkout before committing. Currency conversions in the Inferences sections use assumed rates (about 1 EUR ≈ 4.25 PLN and 1 USD ≈ 3.7 PLN). These rates are assumptions, not sourced figures.

## 1. BrickLink: price per piece, fees, multi-store shipping, API, Wanted List, Studio

### Takeaway
For new common parts in common colours, BrickLink typically costs about 1-15 euro cents per piece. Plain 1x1/1x2 plates are at the bottom of that range, larger plates and windows/doors at the top. Shipping per store (several stores per kit) is the real cost driver for small kits. The API (5,000 calls/day default) is reached through a seller/consumer registration, and Studio plus Wanted List XML give a workable estimate-then-buy pipeline.

### Cited Findings
**Price per piece (new, common parts)**
- A European LEGO Art rebrick comparison found 1,000 black 1x1 round plates sold for €10 plus shipping by European dealers, about €0.01 per part. It also cites an average of about €0.04/part (US ≈ $0.03) for the same part at LEGO Bricks & Pieces. — [StoneWars](https://stonewars.com/features/is-it-really-possible-to-rebrick-lego-art-mosaics-at-a-reasonable-price/)
- A Brickset forum thread says LEGO sold 2x8 plates at 25 cents each while some BrickLink stores asked up to 70 cents for the same part and colour. Users advise that "any time you start going over like 15 cents each" it is worth checking the price (undated forum thread, likely several years old). — [Brickset Forum](https://forum.brickset.com/discussion/35477/how-to-cost-effectively-shop-for-parts-on-bricklink)
- Guide to Studio-to-BrickLink ordering: "common parts typically run a few cents each", while specialised parts run from about 50 cents to several dollars each. — [The Earl of Bricks](https://theearlofbricks.com/blog-studio-to-bricklink-ordering/)
- A MOC-instruction seller tells buyers to budget at least $0.10/piece for parts. — [benbuildslego Gumroad](https://benbuildslego.gumroad.com/l/kPZlz)
- A custom-house LEGO designer (Little Brick Lane) puts the average LEGO piece at about 10 cents (older article). — [Bored Panda](https://www.boredpanda.com/lego-home-replica-little-brick-lane/)
- Benchmark: retail LEGO sets in 2026 work out to about 10-12 cents per piece (BricksDeal). — [BricksDeal](https://bricksdeal.com/de-en/guides/lego-prijs-per-steentje)

**Seller fees (relevant if the business also sells on BrickLink; buyers pay no fee)**
- Sources conflict. Brickem says 5% commission, while other blogs cite a tiered 3% (first $500), 2% (next $500) and 1% (above $1,000), or "about 3%". Payment processing adds about 2.5-4.4%. There are no listing or monthly fees, and total seller cost is about 5-8%. Brickem sells a competing tool, so confirm on BrickLink's own fee page. — [Brickem: fee breakdown](https://brickem.io/blog/bricklink-seller-fees-breakdown); [Brickem: selling fees](https://brickem.io/blog/bricklink-selling-fees); [SellYourToysNow](https://sellyourtoysnow.com/ebay-vs-bricklink-vs-selling-lego/)

**Buying from multiple stores / shipping**
- Shipping can outweigh item prices ("A $3 minifigure with $12 international shipping isn't a deal"). Sellers use either flat-rate or weight/destination-based shipping. International delivery takes about 2-6 weeks depending on origin. — [Brickem buyer guide](https://brickem.io/blog/how-to-use-bricklink-beginner-buyer-guide)
- Wanted List auto-match ("Easy Buy") finds store combinations. You can cap the number of stores and filter by geography, and choose "lowest prices" or "fewest stores". — [The Earl of Bricks: Wanted Lists](https://theearlofbricks.com/blog-bricklink-wanted-lists-guide/); [bartneck.de Stud.io review](https://www.bartneck.de/?p=3391)
- I found no source giving a typical per-store shipping cost to Poland or describing a BrickLink consolidation service (see Gaps).

**API access**
- Default allocation is 5,000 API calls per day per user. Users expecting more, or unsure whether their commercial use is permitted, should contact apisupport@bricklink.com. The terms forbid selling, leasing or sublicensing API access. — [BrickLink API Terms of Use](https://help.bricklink.com/hc/en-us/articles/360034776133-API-Terms-of-Use)
- Credentials are four OAuth 1.0 values (Consumer Key/Secret, Token Value/Secret), registered on BrickLink's API consumer page. Tokens are tied to an IP address, and 0.0.0.0/0.0.0.0 allows any IP. — [BricklinkSharp (GitHub)](https://github.com/cleargreen/BricklinkSharp); [Brikbiz setup](https://www.brikbiz.com/setup-instructions.html)
- One third-party setup guide says you must be registered on BrickLink as a seller before you can generate a token. I did not find an official BrickLink statement confirming this. — [Brikbiz setup](https://www.brikbiz.com/setup-instructions.html); official entry page: [BrickLink Store API welcome](https://www.bricklink.com/v2/api/welcome.page)
- A 2024 forum thread reports a seller hitting the 5,000/day limit while running two external services, with no usage statistics available from support. — [BrickLink forum](https://www.bricklink.com/messageThread.asp?ID=362038)
- The price guide endpoint supports `guide_type` = `sold` (last 6 months) or `stock` (current listings), per wrapper examples. — [bricklink_py (GitHub)](https://github.com/FrogCosmonaut/bricklink_py); [BL Metrics](https://www.blmetrics.com/guides/store-connection)

**Wanted List XML / Studio**
- Studio exports a BrickLink Wanted List XML (File > Export As) with element ID, colour and quantity. Upload is via Want > Upload, by pasting the XML or uploading the file. — [StoneWars XML guide](https://stonewars.com/news/buy-lego-parts-list-on-bricklink-how-to-upload-an-xml-file-as-a-wanted-list/); [BrickLink help: Wanted List mass upload](https://www.bricklink.com/help.asp?helpID=207)
- The XML supports an optional MAXPRICE field (maximum price per piece). — [The Earl of Bricks](https://theearlofbricks.com/blog-studio-to-bricklink-ordering/)
- Studio's price estimate uses the BrickLink Price Guide, based on either the current-for-sale average or the last-6-months sold average. Model Info lists the price of each part. — [Studio Help Center](https://studiohelp.bricklink.com/hc/en-us/articles/5705572363159)
- Limitation: Studio's estimate ignores shipping and the number of sellers. One reviewer's 21,000-brick model was estimated at about NZD 4,500, about NZD 0.21 per piece. — [bartneck.de](https://www.bartneck.de/?p=3391)

### Inferences
- Rough parts-only BOM on BrickLink (new, common parts, house-style mix of bricks, plates, slopes, a few windows and doors), assuming an average of €0.05-0.10/piece:
  - 300 pcs ≈ €15-30
  - 1,500 pcs ≈ €75-150
  - 4,000 pcs ≈ €200-400
  - Shipping is extra: an assumed €4-10 per EU store × 3-10 stores ≈ €12-100 per order. This hits the 300-piece kit hardest, where shipping can match or exceed the parts cost. These per-store figures are my assumption, not a sourced number.
- Windows, doors and less common colours (tan, dark tan, sand green, reddish brown) push the average up. Using Studio's "last 6 months sold average" plus a 20-40% shipping uplift is a reasonable planning method.
- For business-scale buying, the practical pattern is to buy large Wanted Lists for many kits at once (fewer stores, larger lots) rather than one order per customer.
- Plan any automated price checks within the 5,000 calls/day limit. One call per part/colour price guide lookup means a 150-lot kit costs 150 calls, so caching is needed.

### Gaps
- No verified figure for typical BrickLink per-store shipping cost to Poland. Not found in any source I could reach.
- I could not confirm from an official BrickLink page whether a seller (store) account is mandatory for API access. Only a third-party guide claims it.
- No official, current BrickLink fee page was reachable. Fee figures conflict.

## 2. LEGO Pick a Brick (Poland)

### Takeaway
Pick a Brick is available on lego.com/pl-pl. Common elements cost about €0.05-0.15 each, and there is a 30 zł service fee under 60 zł and free delivery above 240 zł. The limits are 999 per element and 400 unique elements per order (US help page), with delivery in 9-15 working days in Europe. It works for small-batch genuine-LEGO production, but price rises, end-of-life of 1,800 parts and per-element caps make it unreliable as the only source.

### Cited Findings
- Polish LEGO.com Pick a Brick page states: "Do zamówień poniżej 60 zł doliczana jest opłata serwisowa w wysokości 30 zł" (a 30 zł service fee on orders under 60 zł) and "BEZPŁATNA dostawa zamówień o wartości powyżej 240 zł" (free delivery on orders over 240 zł). — [LEGO.com PL Pick a Brick](https://www.lego.com/pl-pl/pick-and-build/pick-a-brick)
- Outdated (about 2022): a 53 zł threshold, a 13.50 zł fee for Bestseller and 27 zł for Standard, and free shipping from 200 zł. Bestsellers shipped from a Polish warehouse (typically 6 working days, max 15), Standard from Denmark. — [noweklocki.pl](https://noweklocki.pl/blog/lego-pick-a-brick/); [FanKlocków 2022](https://fanklockow.pl/2022/03/16/nowe-pick-a-prick-juz-na-lego-pl/)
- Since October 2024, all Pick a Brick online orders in Europe have a 9-15 working-day delivery time, down from up to 28 days for Standard. — [New Elementary, Oct 2024](https://www.newelementary.com/2024/10/lego-pick-brick-improvements-in-europe.html?m=0)
- Bestseller parts ship from Poland (9-15 days to the UK). Standard parts used to take up to 28 days from Billund. — [Brick Fanatics](https://www.brickfanatics.com/ordering-lego-pick-brick-about-easier-faster)
- Order limits: "The maximum number of unique pieces that can be ordered is 400 (200 Bestsellers, 200 Standard pieces) and up to 999 of each piece can be ordered at one time". This is the LEGO US help page, and EU limits may differ. — [LEGO help: buying individual pieces](https://www.lego.com/en-us/service/help-topics/article/buying-individual-lego-pieces?age-gate=grown_up)
- March 2025: in Europe, 7,021 elements had a maximum order quantity of 10 and 254 more a maximum of 100. — [New Elementary, Mar 2025](https://www.newelementary.com/2025/03/pick-brick-usa-canada-standard-elements.html)
- 2026 price rise: about one third of about 17,400 analysed elements rose in price. Examples in Europe: Tile 1x1 €0.05 → €0.06, Tile 1x4 €0.12 → €0.14, and a glow-in-the-dark cone €0.05 → €0.35 (+600%). — [StoneWars price analysis 2026](https://stonewars.com/news/lego-pick-a-brick-price-increase-2026/); [Brick Fanatics](https://www.brickfanatics.com/lego-pick-a-brick-prices-increase-by-up-to-600)
- About 1,800 parts are leaving Pick a Brick (EOL list 2026). — [StoneWars EOL list](https://stonewars.com/news/lego-pick-a-brick-eol-list-2026/)
- The German Pick a Brick page shows common parts at about €0.07-0.15 (e.g. element 2431 at €0.14). — [LEGO.com DE Pick a Brick](https://www.lego.com/en-de/pick-and-build/pick-a-brick)
- In-store Pick a Brick wall cups rose by £1/€1 (small) and £2/€2 (large). — [Brick Fanatics](https://www.brickfanatics.com/lego-pick-brick-price-increases-army-building)
- I found no LEGO terms addressing reseller or business accounts on Pick a Brick. The separate Bricks & Pieces (replacement) service reportedly allows up to 200 of a unique element. — [Brick Train Depot](https://bricktraindepot.com/resources/buying-smart/)

### Inferences
- Assuming Pick a Brick averages €0.08-0.12 per piece for a house-style mix, the parts-only BOM is:
  - 300 pcs ≈ €24-36 (≈ 100-150 zł). Under the 240 zł free-delivery threshold, so delivery is paid.
  - 1,500 pcs ≈ €120-180 (≈ 510-770 zł). Free delivery.
  - 4,000 pcs ≈ €320-480 (≈ 1,360-2,040 zł). Free delivery.
- Pick a Brick is often cheaper than BrickLink for larger plates and common bricks in current colours. It is more expensive than the cheapest BrickLink lots for 1x1/1x2 plates.
- It is usable for a small business batching several kits per order: 999 per element is enough for dozens of kits. The 10/100 caps on some elements and EOL removals mean each design needs a BrickLink fallback.
- Delivery of 9-15 working days means it fits a made-to-order lead time only if the business holds stock or quotes 3-4+ weeks to the customer.

### Gaps
- Current Polish delivery fee below 240 zł was not stated in the sources found.
- EU-specific unique-element limit (the 400 / 999 figures are from the US help page).
- No statement from LEGO on whether commercial resale of kits built from Pick a Brick parts breaches terms of sale. I found no restriction, but none was explicitly confirmed either.

## 3. Bulk genuine LEGO (B2B channels, used by the kilo, parting out)

### Takeaway
Used mixed LEGO costs about €11-20/kg in Germany and about 80-90 zł/kg on Polish classifieds, with 700-1,000 pieces/kg, so roughly €0.01-0.03 per piece. Lots are random, so sorting labour and colour and condition variance make them unsuitable for precise custom kits except as a filler stock. I found no LEGO B2B or distributor channel for loose elements.

### Cited Findings
- German eBay used kiloware: 6 kg at €12.50/kg (€74.99), 4 kg at €11.25/kg, 2 kg at €17.50/kg, 1 kg lots at about €14.85-22.99. "1 kg ca. 700-1000 Teile". Another category lists 2 kg ≈ 1,700 bricks at €19/kg. — [eBay kiloware 6 kg](https://www.ebay.com/itm/137236749919); [eBay.de Bulkware](https://www.ebay.de/b/CREATOR-LEGO-R-Bausteine-Bulkware/183448/bn_76153158)
- Steinpalast (DE specialist) sells used kiloware by 100-200-piece packs; DUPLO kiloware is about €32/kg. — [Steinpalast](https://www.steinpalast.eu/en/lego/kiloware)
- Older guide (about 2022): average €5-10/kg, which is likely outdated. — [Bricks Radar](https://bricks-radar.com/en/lego/lego-tips/lego-price-per-kilo/)
- Poland (undated listings): used LEGO by weight at 80 zł/kg (Kołobrzeg) and 1 kg for 89 zł (sprzedajemy.pl). A seller states 5 kg ≈ 4,000-7,500 elements. — [Allegro Lokalnie](https://allegrolokalnie.pl/oferty/klocki/lego-17865/kolobrzeg); [sprzedajemy.pl](https://sprzedajemy.pl/oferty-uzytkownika-10309967/dla-dziecka/zabawki/klocki); [Allegro Lokalnie 5 kg](https://allegrolokalnie.pl/oferta/klocki-lego-oryginalne-mix-5-kg-z-figurkami)
- New "LEGO 1 kg – mix kolorów" (bricks, wheels, tiles, windows) on Kaufland.pl at 260.98 zł. — [Kaufland.pl](https://www.kaufland.pl/product/385593610/)
- Polish loose-LEGO shops exist (lsbricks.pl, mojeklocki24.pl, bricksplace.pl), but no prices were captured. — [LSbricks](https://lsbricks.pl/); [MojeKlocki24](https://mojeklocki24.pl/pl/35-pojedyncze-klocki-lego-na-sztuki)

### Inferences
- Used kiloware at about €0.012-0.03 per piece is the cheapest genuine LEGO, but a house kit needs specific parts and colours. Most of a random kilo would be unusable inventory, and sorting would cost far more labour than the parts saving.
- Used parts are also hard to sell as a "new" premium gift kit. Kiloware is only viable to build a stock of basic colours (white, tan, light/dark bluish grey, red) after washing and grading.
- Parting out new sets (about €0.10-0.12/piece retail per BricksDeal) is not cheaper than BrickLink or Pick a Brick unless sets are bought heavily discounted. It is a fallback for rare parts only.

### Gaps
- No LEGO B2B/distributor channel for loose elements was found. LEGO appears to sell elements only via Pick a Brick and Bricks & Pieces (consumer).
- No dated 2026 sold-price data for kiloware; figures are asking prices.

## 4. Compatible bricks: COBI, GoBricks and Chinese OEM/custom MOC manufacturers, customs/VAT

### Takeaway
GoBricks-grade compatible parts cost about 1-9 US cents per piece, and Chinese custom-kit services (CorporateMocs, Wobrick, BuyMeBricks, Alibaba suppliers) offer custom boxes and printed manuals. MOQs range from "none" (resellers) to 200 sets per design (CorporateMocs), with 2-4 weeks for samples plus 3-4 weeks for production. COBI sells loose parts at 1-3 zł each and shows no evidence of an OEM/custom service. Since 1 July 2026 the EU charges a temporary €3 duty on low-value B2C parcels, while the conventional duty on construction toys appears to be 0%.

### Cited Findings
**COBI (Poland)**
- cobi.pl sells "klocki na sztuki" (loose parts) "aby zrealizować autorskie pomysły" (to build your own designs). Prices: basic 1x1 parts about 1.00-1.50 zł, plates mostly 2.29-2.99 zł (some 9.90 zł), figure accessories 0.50-1.00 zł, 1x6 printed brick 1.90 zł. Prices are undated. — [cobi.pl klocki na sztuki](https://cobi.pl/militaria/klocki-na-sztuki,52); [cobi.pl płytki](https://cobi.pl/militaria/klocki-na-sztuki/plytki,119); [cobi.pl podstawowe](https://cobi.pl/militaria/klocki-na-sztuki/podstawowe,131)
- COBI describes itself as the largest building-block manufacturer in Central and Eastern Europe. It has sales offices in CZ, DE, UK and USA and attends the Hong Kong, Nuremberg, London and New York toy fairs. — [2ttoys COBI history](https://www.2ttoys.nl/en/pages/de-geschiedenis-van-cobi-bouwblokken)
- No evidence found (searched in English and Polish) of a COBI custom/OEM or corporate kit programme. Polish custom-kit firms using other suppliers do exist: Zbudowane z Klocków (personalised corporate kits) and Blocki Custom (klocki-blocki.pl, corporate kits including custom packaging). — [zbudowanezklockow.pl](https://zbudowanezklockow.pl/personalizowane-projekty/); [klocki-blocki.pl/custom](https://www.klocki-blocki.pl/custom)

**GoBricks / compatible parts prices**
- AliExpress GoBricks listings: a 100-piece 1x2 tile lot at $1.64 (≈ 1.6 ¢/pc), a 10-piece 1x2 rounded plate at $0.25 (≈ 2.5 ¢/pc), and single 1x2 plates at $0.07-0.09. Listings mix per-piece and per-lot prices, so verify each one. — [AliExpress GoBricks search](https://www.aliexpress.com/w/wholesale-go-bricks.html); [AliExpress GoBricks custom parts list](https://www.aliexpress.us/item/3256808633824569.html)
- Webrick (site states "Webrick is now brickwith.com"): Brick 2x6 $0.22 and Plate 6x10 $0.59 (single parts), Baseplate 48x48 $7.46. Single parts ship 48-72 h after order, with standard shipping 7-15 business days. — [Webrick bricks](https://www.webrick.com/all-bricks-pieces/bricks.html); [Webrick shipping](https://www.webrick.com/shipping-guide.html); [Webrick home](https://www.webrick.com/)
- The factory is Shantou Gobricks Cultural Technology Co., Ltd. (Alibaba listing, single parts). There is no official retail store, so purchases go through agents with a parts list. — [Alibaba GoBricks](https://www.alibaba.com/pla/Wholesale-Building-Blocks-GobricksGDS-603LEGOing-parts-85861-28626_1600258322459.html?mark=google_shopping&biz=pla&searchText=Building+Block+Sets&product_id=1600258322459&seo=1); [Letbricks vs Gobricks vs LEGO](https://www.letbricks.com/2025/08/letbricks-vs-gobricks-vs-lego-best-moc-builder-bricks-review/)

**Custom kit manufacturers (MOQ, lead time, packaging)**
- CorporateMocs: MOQ of 200 sets per unique design for best pricing, with smaller orders possible at higher prices. Includes custom outer colour box and printed instructions. Sample 2-4 weeks, mass production 3-4 weeks. Ships worldwide (30+ countries), and the buyer handles customs. An older guide quotes DHL express in 3-5 days without customs clearance, or air express with duties included in 5-7 days. — [CorporateMocs FAQ](https://corporatemocs.com/faqs/); [CorporateMocs ordering guide](https://corporatemocs.com/cost-effective-branded-lego-sets-order-guide/)
- Wobrick (GoBricks-based): "no minimum order quantity for most projects", with custom instruction books, colour boxes and private-label packaging. — [Wobrick MOC customization](https://wobrick.com/moc-customization/)
- BuyMeBricks: OEM sets with customised parts and packaging, claiming no minimum (reseller claim). — [BuyMeBricks](https://buymebricks.com/)
- Letbricks: design fees quoted per project. — [Letbricks parts customization](https://www.letbricks.com/parts-customization/)
- buildamoc.com (genuine LEGO elements, EU/EUR): minimum project value $3,500, no minimum number of kits, packs kits with instructions. — [BuildAMOC for business](https://buildamoc.com/pages/for-business)
- Alibaba listings: a Shantou OEM/MOC listing at $0.10-0.30 with "1000 pieces" MOQ (unit ambiguous), a Shenzhen custom MOC set at $8-10 with 300-set MOQ, and Made-in-China custom house block sets at about $8-10 each with MOQ 1-100. A sourcing agent says ABS sets are typically $5-10/set, with a 1,000-piece ship model wholesaling at about $10/set. — [Alibaba Shantou showroom](https://www.alibaba.com/showroom/shantou-building-blocks.html); [Jingsourcing](https://jingsourcing.com/p/building-blocks-from-china/); [Made-in-China](https://www.made-in-china.com/price/house-building-blocks-price.html)
- MOC Brick Land: no public custom-production terms were found.

**Quality / colour matching**
- GoBricks is ABS, with clutch reported as slightly firmer than LEGO and consistent moulds. It has some colours LEGO lacks (Army Green, Bright Gold, Greyish White). No measured colour-match comparison was found. Sources are mostly GoBricks-based sellers, so the reviews may be biased. — [Lumibricks](https://www.lumibricks.com/blogs/news/lego-vs-gobricks-review); [Bobby Brix](https://store.bobbybrix.com/blogs/news/gobricks-vs-lego); [Letbricks](https://www.letbricks.com/2025/08/letbricks-vs-gobricks-vs-lego-best-moc-builder-bricks-review/)

**Customs / VAT to Poland (2026)**
- From 1 July 2026 the €150 duty exemption ended, and a temporary €3 customs duty applies to B2C low-value (≤ €150) e-commerce items. — [EU Access2Markets news](https://trade.ec.europa.eu/access-to-markets/en/news/eu-applies-eu3-customs-duty-item-low-value-e-commerce-consignments); [DHL](https://www.dhl.com/discover/en-cz/logistics-advice/import-export-advice/eu-2026-duty-de-minimis-removal)
- Sources conflict on how the €3 is counted:
  - [FedEx](https://www.fedex.com/en-hk/service-news/eu-customs-reform/de-minimis.html): per declaration line.
  - [Portless](https://www.portless.com/blogs/the-eu-is-ending-de-minimis-exemptions-what-your-brand-needs-to-know): per HS code in a parcel.
  - [Byrd](https://blog.getbyrd.com/en/de-minimis-eu): per item by tariff heading.
- B2B imports pay standard duty rates. — [DHL](https://www.dhl.com/discover/en-cz/logistics-advice/import-export-advice/eu-2026-duty-de-minimis-removal)
- IOSS still handles import VAT but does not remove the €3 duty. A further handling fee of about €2/parcel is expected from November 2026. The €3 regime is planned to end in mid-2028 when the EU Customs Data Hub arrives. — [Oakhill](https://oakhillfinancialservices.com/eu-customs-reform-2026/); [ShipperHQ](https://shipperhq.com/blog/de-minimis-is-ending-in-the-eu-what-ecommerce-brands-need-to-know)
- The conventional EU third-country duty on construction sets is 0%: 95030039 shows 0.000% erga omnes (TARIC, page updated 17 Oct 2026), and 95030035 is the "of plastics" subheading. This was confirmed only via aggregators, and a retailer blog claims 0-4.7% for toys generally. — [tariffnumber.com 95030039](https://www.tariffnumber.com/2026/95030039); [HSCIQ](https://www.hsciq.com/en/HSEU/Code/9503003900); [UK ruling 9503 0035 description](https://www.tax.service.gov.uk/search-for-advance-tariff-rulings/ruling/600005719)

### Inferences
- Parts-only BOM with GoBricks-grade parts (≈ 1-4 US cents per piece for basic parts bought in bulk, more for special parts):
  - 300 pcs ≈ $5-15
  - 1,500 pcs ≈ $20-60
  - 4,000 pcs ≈ $50-160
  - This is roughly 3-5× cheaper than BrickLink or Pick a Brick, before shipping, VAT and the agent's margin.
- Assembled custom kits from China (for example $8-10 per ~1,000-piece set at 300-set MOQ) only work for repeated designs. A one-off house model per customer cannot meet a 200-set MOQ, so for one-offs the realistic China route is buying loose parts in bulk (agent or AliExpress) and kitting locally in Poland.
- For B2B bulk imports into Poland: duty is ≈ 0%, plus 23% Polish VAT (standard rate, from general knowledge, not sourced here) and freight. The €3 low-value duty only matters if parcels are shipped B2C directly from China to end customers.
- COBI's loose-part pricing (≈ 1-3 zł per piece, or €0.25-0.70) is 5-20× BrickLink and has a narrow, military-oriented range. It is not a viable source unless COBI agrees a custom B2B deal, for which no evidence exists.
- Positioning: "genuine LEGO" justifies a premium and avoids quality complaints from adult fans. Compatible bricks maximise margin but must be marketed carefully: no LEGO trademark in product names, and "compatible" wording carries trademark risk. — [Alibaba-related caveat summarised in search](https://jingsourcing.com/p/building-blocks-from-china/)

### Gaps
- No COBI OEM/custom programme, MOQ or price was found. A direct inquiry is needed.
- No official GoBricks OEM page or price list. MOC Brick Land and Mould King custom terms were not found.
- No independent, measured colour-matching study of GoBricks vs LEGO.
- How the €3 duty is counted (per item, per line or per HS code) is unresolved across sources.

## 5. Print-on-demand instructions and custom boxes in Poland

### Takeaway
Small-run full-colour A5 stapled instruction booklets cost about 4-10 zł per copy at 50 copies, depending on page count. Custom-printed boxes at 50-100 units run from a few hundred zł for overprinting stock boxes to 1,400-1,900 zł for personalised window boxes. Custom die-cut boxes usually need MOQs of 300 to 2,000.

### Cited Findings
- Epromedia: A5 brochure, 50 pcs, 199.26 zł gross (162 zł net), full-colour CMYK on 135 g coated paper, 3-5 working days. — [epromedia.pl](https://epromedia.pl/broszury-A5-50szt)
- Barwa: A5 16-page, 50 pcs, 501.15 zł gross (≈ 10 zł/copy), 130 g matt, prices as of 4.10.2026. — [barwa.pl calculator](https://www.barwa.pl/kalkulator-druku-broszur-katalogow-9/)
- Drukxpert: A5, 8 pages, 50 pcs, 404 zł net / 496.63 zł gross (9.93 zł/pc). — [drukxpert.pl](https://drukxpert.pl/produkt/druk-katalogow/)
- Viperprint: stapled A5 catalogue without cover, 50 pcs, 272 zł net / 334.56 zł gross. — [viperprint.pl](https://www.viperprint.pl/produkt/KSZ1670)
- Other Polish online printers for stapled booklets: [onlineprinters.pl](https://www.onlineprinters.pl/p/broszury-a5-zszywane-klamrami); [drukalo.pl](https://drukalo.pl/produkty/broszury-szyte); [print24 PL](https://print24.com/pl/produkty-drukarskie/broszury/broszury-i-ulotki-din-a5)
- Boxes:
  - Overprinting stock boxes: e-hurtownia-opakowan.pl charges 50-100 pcs from 165 zł, 200 pcs 220-275 zł and 500 pcs from 550 zł (print only), with a 99 zł trial print. — [e-hurtownia-opakowan.pl](https://e-hurtownia-opakowan.pl/page/nadruki-1)
  - Printed die-cut (fasonowe) boxes: 100 pcs at 241.00-268.20 zł (Centrum Zaopatrzenia), or Mpackart from 50 pcs, from 500 zł per run, 7-10 working days. — [centrumzaopatrzenia.eu](https://centrumzaopatrzenia.eu/wlasny-nadruk.html); [mpackart.com](https://mpackart.com/pudelka-fasonowe-z-nadrukiem-jednokolorowym/)
  - Personalised window boxes 100x100x105 mm from 100 pcs: 1,431-1,931 zł (quantity tier unclear; page about 1 year old). — [zpapieru.pl](https://zpapieru.pl/produkt/pudelka-kartonowe-z-okienkiem-100x100x105-mm/)
  - Higher-MOQ producers: Nakon has a standard MOQ of 2,000 (1,000 if justified), and opakowaniaozdobne24.eu typically requires 300+ for non-standard sizes, plus the cost of a cutting die. — [nakon.pl](https://nakon.pl/pudelka-kartonowe/); [opakowaniaozdobne24.eu](https://opakowaniaozdobne24.eu/male-pudelka)

### Inferences
- Per-kit packaging at 50-100 units:
  - Instructions: 4-10 zł. A 300-piece model needs about 16-24 pages, 1,500 pieces about 40-60 pages, and 4,000 pieces 100+ pages. Longer manuals cost more, so a PDF or online viewer for large kits is worth considering.
  - Generic mailer box plus printed sleeve or overprint: about 3-6 zł.
  - Fully personalised printed box: about 14-20 zł at 100 units, falling at 300+.
- Because every house is unique, the box should be generic branded stock with a per-customer printed label or sleeve (digital print), not a per-house box.

### Gaps
- No EU print-on-demand service quoting single-copy (1-unit) instruction booklets was captured. Barwa advertises "od 1 szt.", but no 1-unit price was captured.

## 6. Kitting / packing labour and fulfilment services

### Takeaway
I found no published benchmark for the time to pick and bag a 1,000-piece custom kit, and no Polish/EU fulfilment house specialising in custom brick kits. Time trials are needed. Indirect data: building speed is about 300-425 pieces/hour, and a commercial sorting service charges SGD 40 per 500-4,000 pieces.

### Cited Findings
- A build-time calculator estimates a typical builder places about 425 pieces per hour. — [PieceTick](https://piecetick.com/)
- A rule of thumb of "1 hour per 300 pieces" for building. — [SetSquad](https://setsquad.app/how-long-to-build)
- A Singapore seller offers hand-sorting of 500-4,000 pieces for SGD 40, with a 3-7-day turnaround. — [buildwithaudrey Gumroad](https://buildwithaudrey.gumroad.com/l/jnqkxi)
- Custom-kit vendors that include kitting and packing in their service: buildamoc.com (genuine LEGO, $3,500 minimum project), CorporateMocs (200-set MOQ), Wobrick (no MOQ claimed). — [BuildAMOC](https://buildamoc.com/pages/for-business); [CorporateMocs FAQ](https://corporatemocs.com/faqs/); [Wobrick](https://wobrick.com/moc-customization/)

### Inferences
- Rough estimate, unsourced and to be validated by a time trial: picking from organised bins by lot (a 1,000-piece house uses about 100-200 distinct lots) at about 15-30 s per lot plus counting, then bagging into 3-6 numbered bags, is about 1-2 labour-hours per 1,000 pieces. At Polish labour cost of about 35-50 zł/h gross employer cost (an assumption), that is about 35-100 zł per 1,000-piece kit.
- Weighing scales (count-by-weight) for small parts and pre-bagged common lots (e.g. 100× 1x2 white bricks) cut this significantly.

### Gaps
- No sourced labour-time benchmark for brick kitting.
- No identified Polish/EU 3PL offering custom brick kitting.

## 7. Pricing examples of existing custom-kit sellers (margin sanity check)

### Takeaway
Custom house models in Poland start at about 2,000 zł (Ideo Bricks) and 3,000-4,000 zł net (Makiety z Klocków) as built models. US custom house kits sell from $800 (facade) and $1,500 (full house) up to $2,500+. A small house-style kit has sold at $225 for 626 pieces (≈ $0.36 per piece), so consumer prices of 3-10× parts cost per piece are common.

### Cited Findings
- Ideo Bricks (PL, LEGO Certified Professional Mateusz Kustra): "Niepowtarzalna makieta z klocków LEGO® już od 2000 zł" (a unique LEGO model from 2,000 zł), in scales from 1:23 to 1:400-1:800. — [ideo-klocki.pl](https://ideo-klocki.pl/); [Ideo Bricks portfolio](https://www.ideo-bricks.com/portfolio/firma-zbudowana-klockow-lego/)
- Makiety z Klocków (PL): new genuine LEGO only. The smallest model typically costs 3,000-4,000 zł net, with 60-90 days lead time. — [makietyzklockow.pl](https://makietyzklockow.pl/)
- Blueprint Bricks (US, custom sets of your house from official LEGO bricks): facade from $800, full house from $1,500, deluxe from $3,500. — [henryshomemodels.com](https://www.henryshomemodels.com/)
- Little Brick Lane (US, built replicas): $1.25 × home square footage, minimum about $2,500 (older article). — [Bored Panda](https://www.boredpanda.com/lego-home-replica-little-brick-lane/)
- JBalyeat "La Petite Maison" custom house model kit: $225 for 626 pieces (≈ $0.36/pc). — [jbalyeat.com](https://jbalyeat.com/product/la-petite-maison-custom-lego-house-model/)
- BuildAMOC (EU) sells genuine-LEGO MOC kits in EUR, e.g. from €119. — [buildamoc.com](https://buildamoc.com/)
- LEGO retail sets average about €0.10-0.12 per piece in 2026. Ready-made LEGO house sets on zKlockow.pl range 44.90-2,899 zł (average 542.89 zł). — [BricksDeal](https://bricksdeal.com/de-en/guides/lego-prijs-per-steentje); [zklockow.pl](https://zklockow.pl/domy-lego)

### Inferences
- Indicative full BOM per kit (parts + shipping share + instructions + box, excluding design labour and kitting):

  | Kit size | Genuine LEGO (BrickLink/PaB) | Compatible (GoBricks bulk) |
  |---|---|---|
  | 300 pcs | ≈ 120-250 zł | ≈ 40-80 zł |
  | 1,500 pcs | ≈ 450-900 zł | ≈ 120-300 zł |
  | 4,000 pcs | ≈ 1,100-2,200 zł | ≈ 300-700 zł |

- Against Polish built-model prices (from 2,000 zł) and US kit prices ($800-1,500), a genuine-LEGO kit retailing at about 0.6-1.0 zł per piece (e.g. 1,500 pcs at 900-1,500 zł) leaves room for design labour. Compatible bricks roughly double gross margin but weaken the "genuine LEGO" premium positioning.
- The 300-piece tier is dominated by fixed costs (shipping, box, manual, design time), not parts.

### Gaps
- No European seller publishing a per-piece consumer price for custom "your house" kits was found. Polish firms quote individually.
- Several US price points come from older articles and may be outdated.
