import CONFIG from "@/config";

const scheduleTwilioSms = async (message, to, myDateTime, timeZone) => {
    try {
      console.log("SHCELELELELELLEELE",myDateTime.toISOString().slice(0, 19))
      const response = await fetch(CONFIG.backendRoute+"aws/scheduleTwilioSmsLambda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: { message, to },
          dateTime: myDateTime,
          timeZone,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule SMS");
      }
  
      console.log("SMS Scheduled Successfully:", data);
      return data;
    } catch (error) {
      console.error("Error scheduling SMS:", error);
      return { success: false, error: error.message };
    }
  };

export default scheduleTwilioSms;