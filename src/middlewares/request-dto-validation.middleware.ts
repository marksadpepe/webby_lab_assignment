import {plainToInstance, ClassConstructor} from "class-transformer";
import {validate, ValidationError} from "class-validator";
import {Request, Response, NextFunction} from "express";

interface RequestOption {
  isBody?: boolean
  isParams?: boolean
}

function flattenValidationErrors(errors: ValidationError[], parentPath: string = ''): string[] {
  const flattenErrors: string[] = []

  for (const err of errors) {
    const segment = parentPath === '' ? err.property : /^\d+$/.test(err.property) ? `${parentPath}[${err.property}]` : `${parentPath}.${err.property}`

    if (err?.constraints) {
      flattenErrors.push(...Object.values(err?.constraints))
    }

    if (err?.children && err?.children.length) {
      flattenErrors.push(...flattenValidationErrors(err?.children, segment))
    }
  }

  return flattenErrors;
}

export function requestDtoValidationMiddleware<T extends object>(dtoClass: ClassConstructor<T>, options: RequestOption) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {isBody, isParams} = options
    const plain = isBody ? req.body : isParams ? req.params : req.query

    const dtoObj = plainToInstance(dtoClass, plain)

    const errors = await validate(dtoObj, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false
    })

    if (errors.length) {
      return res.status(400).json({
        message: "Bad Request",
        errors: flattenValidationErrors(errors),
      })
    }

    if (isBody) {
      req.body = dtoObj
    } else if (isParams) {
      Object.assign(req.params, dtoObj)
    } else {
      Object.assign(req.query, dtoObj)
    }

    next();
  }
}
