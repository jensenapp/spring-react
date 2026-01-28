import { createContext, useContext, useReducer, useEffect } from "react";

// 1. 建立 Context
export const AuthContext = createContext();

// 2. 建立 Custom Hook 方便其他組件使用
export const useAuth = () => useContext(AuthContext);

// Action Types
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

// Reducer Function: 處理狀態變更
const authReducer = (prevState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...prevState,
        jwtToken: action.payload.jwtToken,
        user: action.payload.user,
        isAuthenticated: true, // 標記為已登入
      };
    case LOGOUT:
      return {
        ...prevState,
        jwtToken: null,
        user: null,
        isAuthenticated: false, // 標記為未登入
      };
    default:
      return prevState;
  }
};

export const AuthProvider = ({ children }) => {
  // 定義初始狀態函數
  const initialAuthState = (() => {
    try {
      // 嘗試從 Local Storage 讀取資料
      const jwtToken = localStorage.getItem("jwtToken");
      const user = localStorage.getItem("user");
      
      // 如果資料存在，回傳已登入的狀態
      if (jwtToken && user) {
        return {
          jwtToken,
          user: JSON.parse(user),
          isAuthenticated: true,
        };
      }
    } catch (error) {
      console.error("Error loading auth state", error);
    }
    
    // 預設狀態 (未登入)
    return {
      jwtToken: null,
      user: null,
      isAuthenticated: false,
    };
  })();

  // 使用 useReducer
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    try {
      if (authState.isAuthenticated) {
        // 登入狀態：寫入 Local Storage
        localStorage.setItem("jwtToken", authState.jwtToken);
        localStorage.setItem("user", JSON.stringify(authState.user));
      } else {
        // 登出狀態：清除 Local Storage
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error saving auth state", error);
    }
  }, [authState]); // 依賴 authState

  // 登入成功時呼叫
  const loginSuccess = (jwtToken, user) => {
    dispatch({ type: LOGIN_SUCCESS, payload: { jwtToken, user } });
  };

  // 登出時呼叫
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        jwtToken: authState.jwtToken,
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};