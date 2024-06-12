export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    // 定义请求的headers
    const headers = {
        "X-API-Key": "sk-b9erd8cqto9savh2v59z-3da297287fc7d81a2ae5327006b325c17234040a",
        "Content-Type": "application/json"
    };

    // 定义请求的body数据
    const data = {
        method: "PUT",
        name: query.name,
        type: query.type
    };

    // 将对象转换为JSON格式的字符串
    const body = JSON.stringify(data);

    try {
        // 发送POST请求
        const response = await fetch("https://api.platform.archivemodel.cn/files/pre-signed-url", {
            method: "POST",
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析响应为JSON
        const responseData = await response.json();
        return responseData;

    } catch (error) {
        return { error: 'Request failed' };
    }
})