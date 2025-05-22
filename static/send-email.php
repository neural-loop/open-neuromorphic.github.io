<?php
// --- Load PHPMailer classes ---
// Adjust the path if you place the PHPMailer 'src' directory elsewhere
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP; // Added for SMTP class

// Make sure the path points correctly to where you uploaded the PHPMailer src files
require '../php_libs/phpmailer/src/Exception.php';
require '../php_libs/phpmailer/src/PHPMailer.php';
require '../php_libs/phpmailer/src/SMTP.php';

// --- Configuration ---
$recipient_email = "jriddiough@gmail.com"; // <<< REPLACE: Where the notification should GO
$sender_email    = "contact@visioninit.dev";         // Your Namecheap Private Email address
$sender_password = "_X$#FeF@A76X";            // <<< REPLACE: Password for contact@visioninit.dev
$sender_name     = "VisionInit Contact Form";        // Optional: Name shown in the 'From' field

$subject         = "New Contact Form Message from VisionInit Website";

// --- Basic Security Check ---
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// --- Get Data & Initialize ---
$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$errors  = [];
$response = ['status' => 'error', 'message' => 'An unexpected error occurred.']; // Default

// --- Validation ---
if (empty($name)) {
    $errors['name'] = 'Name is required.';
}
if (empty($email)) {
    $errors['email'] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format.';
}
if (empty($message)) {
    $errors['message'] = 'Message is required.';
}

// --- Process ---
if (empty($errors)) {
    $mail = new PHPMailer(true); // Passing `true` enables exceptions

    try {
        // --- Server settings ---
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // Enable verbose debug output - REMOVE FOR PRODUCTION
        $mail->isSMTP();                           // Send using SMTP
        $mail->Host       = 'visioninit.dev';        // Set the SMTP server to send through (Your Namecheap server)
        $mail->SMTPAuth   = true;                  // Enable SMTP authentication
        $mail->Username   = $sender_email;         // SMTP username (your Namecheap email)
        $mail->Password   = $sender_password;      // SMTP password (your Namecheap email password)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Enable SSL encryption (since port is 465)
        $mail->Port       = 465;                   // TCP port to connect to; use 587 if you set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        // --- Recipients ---
        $mail->setFrom($sender_email, $sender_name); // Who the email is FROM (Must be your authenticated email)
        $mail->addAddress($recipient_email);        // Add the recipient (where you want to receive the email)
        $mail->addReplyTo($email, $name);           // Set the Reply-To to the user's email and name

        // --- Content ---
        $mail->isHTML(false); // Set email format to plain text
        $mail->Subject = $subject;

        // Compose Email Body (Plain Text) - Sanitize just before outputting
        $email_body = "You have received a new message from your website contact form.\n\n";
        $email_body .= "Name: " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "\n";
        $email_body .= "Email: " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "\n\n";
        $email_body .= "Message:\n" . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . "\n";

        $mail->Body    = $email_body;

        $mail->send();
        $response = ['status' => 'success', 'message' => 'Your message has been sent successfully!'];

    } catch (Exception $e) {
        // Log the detailed error from PHPMailer
        error_log("PHPMailer Error: {$mail->ErrorInfo}");
        // Provide a generic error to the user
        $response = ['status' => 'error', 'message' => "Sorry, there was an error sending your message. Please try again later."];
    }

} else {
    // Validation failed
    $error_message = "Please check the form for errors and try again.";
    $response = ['status' => 'error', 'message' => $error_message, 'errors' => $errors];
}

// --- Return JSON Response ---
if (!headers_sent()) {
    header('Content-Type: application/json');
}
echo json_encode($response);
exit;
?>
