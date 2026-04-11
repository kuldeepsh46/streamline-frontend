import CONFIG from "@/config";

/**
 * Sends a list of URLs to the backend endpoint for deletion using fetch.
 * @param {string[]} urls - Array of S3 URLs to delete.
 * @returns {Promise<void>}
 */
const deleteS3Objects = async ({urls}) => {
    if (!Array.isArray(urls) || urls.length === 0) {
      console.error('The list of URLs must not be empty.');
      return;
    }
  
    try {
        console.log("INSIDE DELEITNG S3 Objs")
      const response = await fetch(CONFIG.backendRoute+'aws/delete-s3-objects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete objects. Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Deletion results:', result);
    //   alert(`Deletion completed: ${JSON.stringify(result.results)}`);
    } catch (error) {
      console.error('Error deleting S3 objects:', error.message);
    //   alert('Failed to delete some or all objects. Please check the console for details.');
    }
  };
  
  export default deleteS3Objects;
  