export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    // 定义请求的headers
    const headers = {
        "X-API-Key": "sk-b9erd8cqto9savh2v59z-3da297287fc7d81a2ae5327006b325c17234040a",
        "Content-Type": "application/json"
    };

    // 定义请求的body数据
    console.log(body)
    // return body
    // 将对象转换为JSON格式的字符串
    // try {

    const response = await fetch("https://api.platform.archivemodel.cn/assistants/query", {
        method: "POST",
        headers: headers,
        body: body
    });
    const reader = response.body;
    return reader
    const decoder = new TextDecoder('utf-8');
    const temp = true
    while (temp) {
        const { done, value } = await reader.read();
        if (done) break;
        let line = decoder.decode(value);
        let lines = line.split('\n');
        lines.forEach(line => {
            if (line.trim() && line.trim().endsWith('}')) {
                line = line.replace('data: ', '');
                line = JSON.parse(line);
            }
        });
    }
    // if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    // }
    console.log(response)
    return response
    // const responseData = await response.json();
    // return responseData

    // } catch (error) {
    //     return { error: 'Request failed' };
    // }
})