
using System;

public static class ExtensionMethod
{
   public static string ToWords(this int number)
    {
        if (number == 0)
            return "zero";

        if (number < 0)
            return "minus " + ToWords(Math.Abs(number));

        string words = "";

        if ((number / 1000000) > 0)
        {
            words += ToWords(number / 1000000) + " million ";
            number %= 1000000;
        }

        if ((number / 1000) > 0)
        {
            words += ToWords(number / 1000) + " thousand ";
            number %= 1000;
        }

        if ((number / 100) > 0)
        {
            words += ToWords(number / 100) + " hundred ";
            number %= 100;
        }

        if (number > 0)
        {
            if (words != "")
                words += "and ";

            var unitsMap = new[] { "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen" };
            var tensMap = new[] { "zero", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety" };

            if (number < 20)
                words += unitsMap[number];
            else
            {
                words += tensMap[number / 10];
                if ((number % 10) > 0)
                    words += "-" + unitsMap[number % 10];
            }
        }

        return words;
    }

     public static string ToTurkishWords(this int number)
    {
        if (number == 0)
            return "sıfır";

        if (number < 0)
            return "eksi " + ToTurkishWords(Math.Abs(number));

        string words = "";

        if ((number / 1000000) > 0)
        {
            words += ToTurkishWords(number / 1000000) + " milyon ";
            number %= 1000000;
        }

        if ((number / 1000) > 0)
        {
            words += ToTurkishWords(number / 1000) + " bin ";
            number %= 1000;
        }

        if ((number / 100) > 0)
        {
            words += ToTurkishWords(number / 100) + " yüz ";
            number %= 100;
        }

        if (number > 0)
        {

            var unitsMap = new[] { "sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on", "on", "on iki "," on üç "," on dört "," on beş "," on altı "," on yedi "," onsekiz "," on dokuz " };
            var tensMap = new[] { "sıfır", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan" };

            if (number < 20)
                words += unitsMap[number];
            else
            {
                words += tensMap[number / 10];
                if ((number % 10) > 0)
                    words += "-" + unitsMap[number % 10];
            }
        }

        return words;
    }
}
