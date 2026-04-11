export default function extractFieldFromJsonList({jsonList, fieldName}) {
    return jsonList.map(json => json[fieldName]).filter(item => item !== undefined);
  }
  