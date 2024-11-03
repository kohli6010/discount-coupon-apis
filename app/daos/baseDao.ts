import { Model, Op, Transaction} from "sequelize";

// this could go in enum folder
export enum FilterCustomStatus {
    NOT_NULL = "NOT_NULL"
}

export default class BaseDao<InputT, OutputT>{
    cls: any
    constructor(cls) {
        this.cls = cls
    }

    public getById = async (id: number, paranoid:boolean= true): Promise<OutputT> => {
        let obj = null
        if (paranoid){
            obj = await this.cls.findByPk(id)
        }
        else{
            obj = await this.cls.findByPk(id, {paranoid})
        }

        return obj
    }
    public deleteByID = async (id: number, t: Transaction = null): Promise<number> => {
        const deleted = await this.cls.destroy({ where: { id: id } , transaction: t })
        return deleted
    }

    public hardDeleteById = async (id: number, t: Transaction = null): Promise<number> => {
        return await this.cls.destroy(
            {
                where: { id },
                force: true,
                transaction: t

            }
        );
    }

    public create = async (input: InputT, t: Transaction = null): Promise<OutputT> => {
        const obj = await this.cls.create(input, { transaction: t })
        return obj
    }

    public createMultiple = async (input: InputT[], t: Transaction = null): Promise<OutputT[]> => {
        const obj = await this.cls.bulkCreate(input, { transaction: t })
        return obj
    }

    public getAllPaginatedV2= async (limit: number, offset: number, sort:{field: string, order: string} = null, filter: {} = null, paranoid: boolean = null): Promise<{ rows: OutputT[]; count: number }> => {
        let orderArr: Array<Array<string>> = [];

        if (sort && sort.field && sort.order) {
            orderArr = [[sort.field, sort.order]]
        }

        return await this.cls.findAndCountAll(
            {
                limit,
                offset,
                where: filter,
                paranoid,
                order: orderArr
            }
        );
    }

    public getAll = async (filter: {} = null, sort:{field: string, order: string} = null, paranoid:boolean = true): Promise<OutputT[]> => {
        let orderArr: Array<Array<string>> = [];
        let where: {} = {}
        if (filter) {
            Object.keys(filter).forEach((key) => {
                if(filter[key] === FilterCustomStatus.NOT_NULL) {
                    where[key] = {
                        [Op.not]: null
                    }
                    return;
                }
                if(filter[key] === null) {
                    where[key] = {
                        [Op.eq]: null
                    }
                    return;
                }
                if(typeof filter[key] !== 'undefined') {
                    if(Array.isArray(filter[key])){
                        where[key] = {
                            [Op.in]: filter[key]
                        }
                    }
                    else{
                        where[key] = {
                            [Op.eq]: filter[key]
                        }
                    }


                }
            })
        }
        if (sort && sort.field && sort.order) {
            orderArr = [[sort.field, sort.order]]
        }
        return await this.cls.findAll(
            {
                where,
                order: orderArr,
                paranoid
            },
        );
    }


    public updateById = async (id: number, data: InputT, t: Transaction = null): Promise<OutputT> => {
        await this.cls.update(
            data,
            {
                where: {id},
                transaction: t
            }
        )
        return await this.getById(id)
    }

    public update = async (data: InputT, t: Transaction = null): Promise<OutputT> => {
        await (data as any).save({ transaction: t });
        const result = await this.getById((data as any).id)
        return result;
    }

    public reload = async (data: OutputT) => {
        return await (data as any).reload()
    }

    public upsert = async (input: InputT, t: Transaction = null): Promise<OutputT> => {
        const [obj, created] = await this.cls.upsert(input, { transaction: t })
        return obj
    }

    public getOrCreate = async (filter: object, defaults: object = {}): Promise<[OutputT,boolean]> => {
        return await this.cls.findOrCreate({
            where: filter,
            defaults
        });
    }

    public updateMany = async (data: any, filter: any,t: Transaction = null): Promise<OutputT> => {
        return await this.cls.update(data, {where: filter})
    }

    public bulkCreateOrUpdate = async (input: InputT[], updateOnDuplicate: string[] = [],t: Transaction = null): Promise<OutputT[]> => {
        const obj = await this.cls.bulkCreate(input, { updateOnDuplicate, transaction: t })
        return obj
    }
}