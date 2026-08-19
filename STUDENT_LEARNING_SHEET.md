# 🎓 FlavourCraft - Student Code Explanation & Teacher Defense Cheat Sheet

> **Project Name**: FlavourCraft Restaurant Management System  
> **Tech Stack**: HTML5, Plain CSS3, Vanilla JS, Basic PHP, MySQLi, MySQL  
> **Purpose**: Quick revision sheet for explaining every code block line-by-line to your teacher.

---

## 📌 1. Database Connection & Helpers (`config/db.php`)

### 🔹 Code to explain:
```php
ob_start();
session_start();

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port);
mysqli_set_charset($conn, "utf8mb4");
```

### 🗣️ How to explain to your teacher:
* **`ob_start()`**: *"Teacher, this starts Output Buffering. It holds output in server memory so we can safely use `header('Location: ...')` redirects without getting 'Headers already sent' errors."*
* **`session_start()`**: *"This starts the PHP session so our system remembers the logged-in user and their shopping cart across different pages."*
* **`mysqli_connect()`**: *"This establishes a procedural connection to our MySQL database using the hostname, username, password, database name, and port (3306)."*
* **`mysqli_set_charset($conn, "utf8mb4")`**: *"This sets the character encoding to UTF-8 so Bengali text, dish descriptions, and emojis display properly."*

---

## 📌 2. Public Menu & Live Filter (`index.php`)

### 🔹 Code to explain:
```php
$conn = get_db();
$selected_category = $_GET['category'] ?? 'all';
$search_query = trim($_GET['search'] ?? '');

$sql = "SELECT * FROM menu_items WHERE 1=1";

if ($selected_category !== 'all' && !empty($selected_category)) {
    $safe_cat = mysqli_real_escape_string($conn, $selected_category);
    $sql .= " AND category_slug = '{$safe_cat}'";
}

if (!empty($search_query)) {
    $safe_search = mysqli_real_escape_string($conn, $search_query);
    $sql .= " AND (name LIKE '%{$safe_search}%' OR description LIKE '%{$safe_search}%' OR tags LIKE '%{$safe_search}%')";
}

$item_res = mysqli_query($conn, $sql);
while ($row = mysqli_fetch_assoc($item_res)) {
    $menu_items[] = $row;
}
```

### 🗣️ How to explain to your teacher:
* **`$_GET['category']` & `$_GET['search']`**: *"These retrieve the query parameters from the URL when a customer clicks a category button or types in the search bar."*
* **`WHERE 1=1`**: *"A standard SQL programming pattern that allows us to dynamically append `AND` conditions without checking if `WHERE` already exists."*
* **`mysqli_real_escape_string()`**: *"We sanitize all inputs before putting them in the SQL query to prevent SQL Injection attacks."*
* **`mysqli_query()` & `mysqli_fetch_assoc()`**: *"We send the query to MySQL with `mysqli_query()`, then use a `while` loop with `mysqli_fetch_assoc()` to fetch each dish row by row into an array."*

---

## 📌 3. Cart & VAT Calculation (`cart.php` & `cart_action.php`)

### 🔹 Code to explain:
```php
if ($action === 'add') {
    $item_uid = trim($_POST['item_uid'] ?? '');
    $quantity = max(1, (int)($_POST['quantity'] ?? 1));
    
    $safe_uid = mysqli_real_escape_string($conn, $item_uid);
    $res = mysqli_query($conn, "SELECT * FROM menu_items WHERE item_uid = '{$safe_uid}' LIMIT 1");
    $item = mysqli_fetch_assoc($res);
    
    if ($item) {
        if (isset($_SESSION['cart'][$item_uid])) {
            $_SESSION['cart'][$item_uid]['quantity'] += $quantity;
        } else {
            $_SESSION['cart'][$item_uid] = [
                'item_uid' => $item['item_uid'],
                'name' => $item['name'],
                'price' => (float)$item['price'],
                'quantity' => $quantity
            ];
        }
    }
}
```

```php
$subtotal = 0;
foreach ($_SESSION['cart'] as $item) {
    $subtotal += ($item['price'] * $item['quantity']);
}
$vat = $subtotal * 0.05;
$delivery_fee = ($order_type === 'Delivery') ? 60.00 : 0.00;
$total_amount = $subtotal + $vat + $delivery_fee;
```

### 🗣️ How to explain to your teacher:
* **Cart Storage**: *"We use PHP's native `$_SESSION['cart']` associative array. No temporary table needed. If the dish already exists in the cart, we just add to its quantity."*
* **Billing Formula**:
  * $\text{Subtotal} = \sum (\text{Price} \times \text{Quantity})$
  * $\text{VAT} = \text{Subtotal} \times 0.05$ (5% Bangladesh standard restaurant VAT)
  * $\text{Delivery Fee} = \text{৳60}$ (if Delivery) or $\text{৳0}$ (if Dine-In)
  * $\text{Total Amount} = \text{Subtotal} + \text{VAT} + \text{Delivery Fee}$

---

## 📌 4. Atomic Order Placement & Automatic Stock Deduction (`place_order.php`)

### 🔹 Code to explain:
```php
mysqli_begin_transaction($conn);

try {
    mysqli_query($conn, "INSERT INTO orders (...) VALUES (...)");

    foreach ($cart as $item) {
        mysqli_query($conn, "INSERT INTO order_items (...) VALUES (...)");

        $recipe_res = mysqli_query($conn, "
            SELECT ri.ingredient_uid, ri.quantity AS ingredient_qty
            FROM recipes r
            JOIN recipe_ingredients ri ON r.recipe_uid = ri.recipe_uid
            WHERE r.menu_item_uid = '{$safe_item_uid}'
        ");
        
        while ($ing = mysqli_fetch_assoc($recipe_res)) {
            $deduct_amount = (float)$ing['ingredient_qty'] * $item_qty;
            mysqli_query($conn, "
                UPDATE inventory 
                SET current_stock = GREATEST(0, current_stock - {$deduct_amount})
                WHERE ingredient_uid = '{$safe_ing_uid}'
            ");
        }
    }

    mysqli_commit($conn);
} catch (Exception $e) {
    mysqli_rollback($conn);
}
```

### 🗣️ How to explain to your teacher:
* **`mysqli_begin_transaction()`**: *"Teacher, this guarantees ACID compliance. If any step fails (e.g. server crash or stock error), `mysqli_rollback()` undoes everything. When all steps succeed, `mysqli_commit()` saves the order permanently."*
* **Recipe Costing & Inventory Deduction (BOM)**: *"When 1 Kacchi Biryani is ordered, the system looks up the recipe ingredients (e.g. 250g Mutton, 180g Chinigura Rice) and automatically subtracts those exact amounts from the `inventory` table using `GREATEST(0, current_stock - deduct)` so stock never goes below 0."*

---

## 📌 5. Menu Management CRUD & Photo Upload (`menu_manage.php`)

### 🔹 Code to explain:
```php
function handle_image_upload($existing_url = '') {
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $file_tmp = $_FILES['image_file']['tmp_name'];
        $ext = strtolower(pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        
        if (in_array($ext, $allowed)) {
            $new_filename = 'dish_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            $destination = __DIR__ . '/uploads/' . $new_filename;
            if (move_uploaded_file($file_tmp, $destination)) {
                return 'uploads/' . $new_filename;
            }
        }
    }
    return $_POST['image_url'] ?? $existing_url;
}
```

### 🗣️ How to explain to your teacher:
* **Direct File Upload**: *"The form uses `enctype='multipart/form-data'`. PHP receives the temporary file in `$_FILES['image_file']`, validates safe image extensions (`jpg`, `png`, `webp`), generates a unique timestamped filename, and moves it to the `uploads/` directory with `move_uploaded_file()`."*
* **Fallback**: *"If no photo is uploaded, the manager can also paste a web image link in the text box."*

---

## 📌 6. Role-Based Access Control (`includes/auth_check.php`)

### 🔹 Code to explain:
```php
function check_auth($allowed_roles = []) {
    $user = get_current_user_data();
    if (!isset($_SESSION['user']) || empty($_SESSION['user']['user_uid'])) {
        header('Location: login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
        exit;
    }
    if (!empty($allowed_roles) && !in_array($user['role'], $allowed_roles)) {
        header('Location: index.php');
        exit;
    }
    return $user;
}
```

### 🗣️ How to explain to your teacher:
* **Authentication Gate**: *"If a visitor is not logged in, `check_auth()` redirects them to `login.php` while preserving the intended page in `?redirect=`."*
* **Role Gate**: *"If a Customer attempts to access staff-only pages like `inventory.php` or `menu_manage.php`, the function detects that their role is not in the allowed list (`Admin`, `Manager`) and redirects them safely to `index.php`."*

---

## 📌 7. Table Reservations & Privacy Gate (`reservations.php`)

### 🔹 Code to explain:
```php
if ($is_staff) {
    $res = mysqli_query($conn, "SELECT * FROM reservations ORDER BY id DESC");
} else {
    $safe_phone = mysqli_real_escape_string($conn, $user['phone']);
    $res = mysqli_query($conn, "SELECT * FROM reservations WHERE guest_phone = '{$safe_phone}' ORDER BY id DESC");
}
```

### 🗣️ How to explain to your teacher:
* **Customer Privacy**: *"Admin and Manager can see all restaurant bookings, but regular customers only query rows matching their own verified phone number, ensuring guest privacy."*

---

## 📌 8. Kitchen Display System (`kds.php` & `kds_action.php`)

### 🔹 Code to explain:
```php
$sql = "
    SELECT o.*, 
           GROUP_CONCAT(CONCAT(oi.quantity, 'x ', oi.item_name) SEPARATOR '||') AS items_summary
    FROM orders o
    LEFT JOIN order_items oi ON o.order_uid = oi.order_uid
    WHERE o.status IN ('New', 'Preparing', 'Ready to Serve')
    GROUP BY o.order_uid
    ORDER BY o.id DESC
";
```

### 🗣️ How to explain to your teacher:
* **`GROUP_CONCAT`**: *"An SQL aggregate function that bundles all ordered dishes for a ticket into a single string (e.g. `2x Mutton Kacchi || 1x Shahi Borhani`), allowing the kitchen screen to render tickets cleanly without running multiple queries."*
* **Status Updates**: *"When Chef Rony clicks 'Start Cooking' or 'Ready to Serve', `kds_action.php` executes `UPDATE orders SET status = ...` and updates the ticket status."*

---

## 📌 9. Executive Analytics (`analytics.php`)

### 🔹 Code to explain:
```php
$rev_res = mysqli_query($conn, "SELECT COUNT(id) AS total_orders, SUM(total_amount) AS total_revenue FROM orders");
$top_res = mysqli_query($conn, "
    SELECT item_name, SUM(quantity) AS total_qty, SUM(item_total) AS total_sales
    FROM order_items
    GROUP BY item_name
    ORDER BY total_qty DESC
    LIMIT 5
");
```

### 🗣️ How to explain to your teacher:
* **Aggregate Functions**: *"We use `SUM(total_amount)` and `COUNT(id)` to calculate total restaurant revenue turnover and volume, and `GROUP BY item_name ORDER BY total_qty DESC LIMIT 5` to find the top 5 most popular dishes."*

---

## 🎯 Top 5 Key Terms to Remember for Your Viva

| Term | What it means in our project |
| :--- | :--- |
| **`mysqli_connect()`** | Opens connection from PHP to MySQL server. |
| **`mysqli_real_escape_string()`** | Sanitizes text inputs to prevent SQL Injection. |
| **`mysqli_query()`** | Executes an SQL string on the database. |
| **`mysqli_fetch_assoc()`** | Reads one database row into a PHP associative array (`$row['name']`). |
| **`$_SESSION`** | Server-side memory holding the logged-in user and shopping cart. |
