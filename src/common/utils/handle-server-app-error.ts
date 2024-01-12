import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { BaseResponseType } from "common/types/common.types";

/**
 * Функция для обработки ошибок, возвращаемых сервером при работе с приложением.
 * @param {Object} data - Объект, содержащий информацию об ошибке, возвращенной сервером.
 * @param {Function} dispatch - Функция, используемая для отправки действий в Redux store.
 * @param {boolean} [showGlobalError=true] - Булевое значение, определяющее, следует ли отображать глобальное сообщение об ошибке. По умолчанию равно true.
 */

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showGlobalError = true) => {
  if (showGlobalError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
