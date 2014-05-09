<?php
class EmailText{
	
	const NEW_PATIENT = "Hello {{FirstName}},\n\nAn MHT account has been created/updated for you.\nPlease visit the following link to create/update your password:\nhttps://path.sunnybrook.ca/mht/?n={{Nonce}}\n\nYou can then visit https://path.sunnybrook.ca/mht/ to log in using your email address and password.\n\nSincerely,\nMHT System Administrator";
	
	const NEW_CLINICIAN = "Hello {{FirstName}},\n\nA PATH account has been created/updated for you.\nPlease visit:\nhttps://path.sunnybrook.ca/path/\nand log in using your SHSC ID and password.\n\nSincerely,\nPATH System Administrator";
		
	const EMAIL_PASSWORD = "Hello {{FirstName}},\n\nTo reset your password, please visit the following link: https://path.sunnybrook.ca/mht/?n={{Nonce}}\n\nIf you were not trying to reset your password, don't worry. Your current password is still secure. It cannot be changed unless you access the link above and enter a new one.\n\nSincerely,\nMHT System Administrator";
	
	const RESET_PASSWORD = "Hello {{FirstName}},\n\nYour MHT password has recently been created/reset.\n\nPlease visit https://path.sunnybrook.ca/mht/ and log in using your email address and password.\n\nPlease contact pathadmin@sunnybrook.ca if your password has been reset without your permission.\n\nSincerely,\nMHT System Administrator";
		
	public static function getSubject()
	{
		$subject = "Mental Health Telemetry";
		return $subject;
	}
	
	public static function getHeader()
	{
    	$headers = 'From: pathadmin@sunnybrook.ca' . "\r\n" .
			'Reply-To: pathadmin@sunnybrook.ca' . "\r\n" .
			'X-Mailer: PHP/' . phpversion();
		return $headers;
	}	
	
	public static function getText($message, $data = array("id" => "10"))
	{
    	foreach($data as $key => $value){
        	$message = str_replace("{{" . $key . "}}", $value , $message);
    	}
    	return $message;
	}	

	public static function showError($error)
	{
   		echo $error;
	}
}
?>