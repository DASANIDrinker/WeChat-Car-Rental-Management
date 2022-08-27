import axios from "axios";
import router from "../router";

//创建一个axios对象，默认getaway接口的前缀连接
const axiosLogin = axios.create({
    baseURL: "http://localhost:8081/",//baseURL是axios内部封装的一个参数，在执行时候Url=baseURL+request url
    timeout: 20000        //request timeout  设置请求过期时间为2万毫秒
})

//声明一个统一的key  用于把token存储在localStorage中或者在header头中传token时的key
//就是声明一个公共的key，因为每个接口都需要传此参，所以将他放进header中传

// axiosService.tokenParm = "mytoken";

axiosLogin.interceptors.response.use(
    res => {
        //请求成功对应响应数据做处理
        //该返回的数据则是axios.then(res)中接受的数据

        if (res.status == 200 && res.data == 'success') {//正常获得返回信息
            return true
        }else{
            return false
        }

    },
    err => {
        //在请求错误时要做的事儿
        //该返回数据则是axios.catch(err)中接收的数据
        return false;
    }
)

export default axiosLogin;