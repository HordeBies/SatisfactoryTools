import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import data from '@src/Data/Data';
import {Constants} from '@src/Constants';

export class ExtractorDetailsComponentController
{

	public building: IBuildingSchema;
	public overclock: number = 100;
	public purity: 'impure'|'normal'|'pure' = 'normal';

	public get powerConsumption(): number|undefined
	{
		if (this.building.metadata.powerConsumption && this.building.metadata.powerConsumptionExponent) {
			return this.building.metadata.powerConsumption * Math.pow(this.overclock / 100, this.building.metadata.powerConsumptionExponent);
		}
	}

	public get manufacturingSpeed(): number|undefined
	{
		if (this.building.metadata.manufacturingSpeed) {
			return this.building.metadata.manufacturingSpeed * (this.overclock / 100);
		}
	}

	public get extractor(): IMinerSchema
	{
		return this.getExtractor(this.building.className);
	}

	public get isWaterExtractor(): boolean
	{
		return this.building.className === Constants.WATER_EXTRACTOR_CLASSNAME;
	}

	public get extractionRate(): number|undefined
	{
		return this.getExtractionValues(this.building, this.extractor, this.purity) * (this.overclock / 100);
	}

	public getExtractor(className: string): IMinerSchema
	{
		return data.getRawData().miners[className.replace('Desc', 'Build')];
	}

	public getExtractionValues(building: IBuildingSchema, extractor: IMinerSchema, purity: 'impure'|'normal'|'pure'): number
	{
		const extractorMultiplier = Constants.WATER_EXTRACTOR_CLASSNAME === building.className ? 0 : 1;
		const extractedValue = (60 / extractor.extractCycleTime) * (extractor.itemsPerCycle / (extractor.allowLiquids ? 1000 : 1));
		switch (purity) {
			case 'impure':
				return extractedValue * Constants.RESOURCE_MULTIPLIER_IMPURE * extractorMultiplier;
			case 'normal':
				return extractedValue * Constants.RESOURCE_MULTIPLIER_NORMAL;
			case 'pure':
				return extractedValue * Constants.RESOURCE_MULTIPLIER_PURE * extractorMultiplier;
		}
	}

}