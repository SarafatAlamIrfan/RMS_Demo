<?php
/**
 * FlavourCraft Dhaka - Reservations API
 * Handles Table Bookings, Deposits, and e-Pass QR Verification
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------------------------------------------
// 1. GET /api/reservations.php - List all reservations
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM reservations ORDER BY id DESC");
    $rows = $stmt->fetchAll();

    $reservations = [];
    foreach ($rows as $r) {
        $reservations[] = [
            'id' => $r['booking_uid'],
            'bookingCode' => $r['booking_code'],
            'guestName' => $r['guest_name'],
            'guestPhone' => $r['guest_phone'],
            'guestEmail' => $r['guest_email'],
            'partySize' => (int)$r['party_size'],
            'date' => $r['reservation_date'],
            'timeSlot' => $r['time_slot'],
            'tablePreference' => $r['table_preference'],
            'assignedTable' => $r['assigned_table'],
            'depositPaid' => (float)$r['deposit_paid'],
            'status' => $r['status'],
            'specialRequest' => $r['special_request'],
            'createdAt' => $r['created_at']
        ];
    }

    sendResponse(['success' => true, 'reservations' => $reservations]);
}

// ----------------------------------------------------------------------------
// 2. POST /api/reservations.php - Create New Reservation & Generate e-Pass
// ----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();

    $bookingUid = 'res_' . time() . '_' . rand(100, 999);
    $bookingCode = $input['bookingCode'] ?? ('FC-DHK-' . rand(100, 999));
    $guestName = trim($input['guestName'] ?? '');
    $guestPhone = trim($input['guestPhone'] ?? '');
    $guestEmail = trim($input['guestEmail'] ?? '');
    $partySize = (int)($input['partySize'] ?? 2);
    $resDate = $input['date'] ?? date('Y-m-d');
    $timeSlot = $input['timeSlot'] ?? '20:00';
    $tablePref = $input['tablePreference'] ?? 'Main Dining Hall';
    $assignedTable = $input['assignedTable'] ?? 'T-01';
    $depositPaid = (float)($input['depositPaid'] ?? 0);
    $specialRequest = trim($input['specialRequest'] ?? '');

    if (empty($guestName) || empty($guestPhone) || empty($guestEmail)) {
        sendResponse(['success' => false, 'error' => 'Guest Name, Phone, and Email are required.'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO reservations 
        (booking_uid, booking_code, guest_name, guest_phone, guest_email, party_size, reservation_date, time_slot, table_preference, assigned_table, deposit_paid, status, special_request)
        VALUES 
        (:buid, :bcode, :gname, :gphone, :gemail, :psize, :rdate, :tslot, :tpref, :atbl, :dep, 'Confirmed', :sreq)
    ");

    $stmt->execute([
        'buid' => $bookingUid,
        'bcode' => $bookingCode,
        'gname' => $guestName,
        'gphone' => $guestPhone,
        'gemail' => $guestEmail,
        'psize' => $partySize,
        'rdate' => $resDate,
        'tslot' => $timeSlot,
        'tpref' => $tablePref,
        'atbl' => $assignedTable,
        'dep' => $depositPaid,
        'sreq' => $specialRequest
    ]);

    sendResponse([
        'success' => true,
        'message' => 'Table reservation confirmed and e-Pass generated!',
        'reservation' => [
            'id' => $bookingUid,
            'bookingCode' => $bookingCode,
            'guestName' => $guestName,
            'date' => $resDate,
            'timeSlot' => $timeSlot,
            'depositPaid' => $depositPaid
        ]
    ], 201);
}

sendResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
