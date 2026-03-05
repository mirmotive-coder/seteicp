import Time "mo:core/Time";
import BlobMixin "blob-storage/Mixin";

actor {

  // ── Types ─────────────────────────────────────────────────────────────────

  type Product = {
    id                : Nat;
    name              : Text;
    price             : Float;
    image             : Text;
    pieceCount        : Text;
    peopleRecommended : Text;
    category          : Text;
    enabled           : Bool;
  };

  type OrderItem = {
    productId : Nat;
    name      : Text;
    price     : Float;
    quantity  : Nat;
  };

  type Order = {
    orderNumber  : Nat;
    items        : [OrderItem];
    totalPrice   : Float;
    phone        : Text;
    customerName : Text;
    address      : Text;
    deliveryType : Text;
    deliveryTime : Text;
    createdAt    : Int;
  };

  type OrderInput = {
    items        : [OrderItem];
    totalPrice   : Float;
    phone        : Text;
    customerName : Text;
    address      : Text;
    deliveryType : Text;
    deliveryTime : Text;
  };

  // ── State ─────────────────────────────────────────────────────────────────

  stable var products      : [Product] = [];
  stable var orders        : [Order]   = [];
  stable var nextProductId : Nat       = 1;
  stable var nextOrderNum  : Nat       = 100;
  stable var seeded        : Bool      = false;

  // ── Seed ──────────────────────────────────────────────────────────────────

  if (not seeded or products.size() == 0) {
    seeded := true;
    products := [
      { id=1;  name="Veg Set";         price=27.0; image=""; pieceCount="32 gab"; peopleRecommended="Ideali 1-2 cilveekiem"; category="set";   enabled=true },
      { id=2;  name="Classic Set";     price=39.0; image=""; pieceCount="48 gab"; peopleRecommended="Ideali 2-3 cilveekiem"; category="set";   enabled=true },
      { id=3;  name="Premium Set";     price=52.0; image=""; pieceCount="64 gab"; peopleRecommended="Ideali 3-4 cilveekiem"; category="set";   enabled=true },
      { id=4;  name="Tempura Set";     price=45.0; image=""; pieceCount="48 gab"; peopleRecommended="Ideali 2-3 cilveekiem"; category="set";   enabled=true },
      { id=5;  name="Family Set";      price=69.0; image=""; pieceCount="80 gab"; peopleRecommended="Ideali 4-6 cilveekiem"; category="set";   enabled=true },
      { id=6;  name="Chef Special";    price=59.0; image=""; pieceCount="64 gab"; peopleRecommended="Ideali 3-4 cilveekiem"; category="set";   enabled=true },
      { id=7;  name="Party Set";       price=89.0; image=""; pieceCount="96 gab"; peopleRecommended="Ideali 6-8 cilveekiem"; category="set";   enabled=true },
      { id=8;  name="Spicy Tuna Roll"; price=9.0;  image=""; pieceCount="8 gab";  peopleRecommended="Pielikums";             category="addon"; enabled=true },
      { id=9;  name="Salmon Roll";     price=8.0;  image=""; pieceCount="8 gab";  peopleRecommended="Pielikums";             category="addon"; enabled=true },
      { id=10; name="Crunch Roll";     price=10.0; image=""; pieceCount="8 gab";  peopleRecommended="Pielikums";             category="addon"; enabled=true },
      { id=11; name="Pepsi";           price=2.5;  image=""; pieceCount="0.5L";   peopleRecommended="Dzeriens";              category="drink"; enabled=true },
      { id=12; name="Pepsi Max";       price=2.5;  image=""; pieceCount="0.5L";   peopleRecommended="Dzeriens";              category="drink"; enabled=true },
      { id=13; name="Mirinda";         price=2.5;  image=""; pieceCount="0.5L";   peopleRecommended="Dzeriens";              category="drink"; enabled=true },
      { id=14; name="Water";           price=2.0;  image=""; pieceCount="0.5L";   peopleRecommended="Dzeriens";              category="drink"; enabled=true },
    ];
    nextProductId := 15;
  };

  // ── Products ──────────────────────────────────────────────────────────────

  public query func getProducts() : async [Product] {
    products.filter(func(p : Product) : Bool { p.enabled })
  };

  public query func getAllProducts() : async [Product] { products };

  public func addProduct(
    name : Text, price : Float, image : Text,
    pieceCount : Text, peopleRecommended : Text, category : Text
  ) : async Product {
    let p : Product = {
      id = nextProductId; name; price; image;
      pieceCount; peopleRecommended; category; enabled = true
    };
    products := products.concat([p]);
    nextProductId += 1;
    p
  };

  public func updateProduct(
    id : Nat, name : Text, price : Float, image : Text,
    pieceCount : Text, peopleRecommended : Text, category : Text
  ) : async Bool {
    var found = false;
    products := products.map(func(p : Product) : Product {
      if (p.id == id) {
        found := true;
        { p with name; price; image; pieceCount; peopleRecommended; category }
      } else { p }
    });
    found
  };

  public func toggleProductEnabled(id : Nat) : async Bool {
    var newState = false;
    products := products.map(func(p : Product) : Product {
      if (p.id == id) {
        newState := not p.enabled;
        { p with enabled = not p.enabled }
      } else { p }
    });
    newState
  };

  // ── Orders ────────────────────────────────────────────────────────────────

  public func submitOrder(input : OrderInput) : async Order {
    let o : Order = {
      orderNumber  = nextOrderNum;
      items        = input.items;
      totalPrice   = input.totalPrice;
      phone        = input.phone;
      customerName = input.customerName;
      address      = input.address;
      deliveryType = input.deliveryType;
      deliveryTime = input.deliveryTime;
      createdAt    = Time.now();
    };
    orders := orders.concat([o]);
    nextOrderNum += 1;
    o
  };

  public query func getOrders() : async [Order] { orders };

  // ── Blob storage ──────────────────────────────────────────────────────────
  include BlobMixin();
};
